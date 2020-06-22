# github-api

Olá time da Rock Content! Antes de mais nada gostaria  de agradecer a oportunidade, a empresa de vocês parece ser bem legal então só de participar do processo seletivo já é algo que eu fico bem  agradecido.

Este documento vai ser quase como uma conversa informal entre nós, vou explicar algumas das minhas escolhas e mostrar por alto pedaços do meu código. O resto acredito que vocês vão preferir avaliar diretamente no meu código.

Espero que vocês gostem do meu trabalho, estou ansioso para receber o code-review! Sintam-se à vontade para me dar críticas construtivas.

## Introdução

Todas as minhas escolhas foram baseadas exclusivamente no que foi pedido no documento de especificação do teste. Logo, meu foco seguiu os seguintes preceitos:
- Aplicar da melhor maneira para o problema as funcionalidades da API do github
- Deixar a implementação o mais simples possível, usando "dumb code" sempre que condizente. [Minha opinião sobre dumb code](https://hackernoon.com/why-senior-devs-write-dumb-code-and-how-to-spot-a-junior-from-a-mile-away-27fa263b101a)
- Gerar uma solução que faça sentido existir como um microsserviço, no caso algo pequeno, com as dependências escolhidas a dedo

## Arquitetura - Overview

A aplicação trata-se de um projeto em NodeJS que realiza comunicação com a API do GIthub para conseguir dados referentes a repositórios das seguintes organizações: ['hapijs', 'expressjs', 'rockcontent', 'Netflix', 'adobe'].

Foi criado apenas um ambiente de desenvolvimento, já que estamos lidando com um teste. A aplicação roda utilizando "docker-compose", logo, ela foi projetada para ser escalada em uma arquitetura de microsserviços. Lembrando que temos duas formas de rodar este teste, mas isso será explicado nos próximos tópicos.

A aplicação conta com testes (coverage de 95.77%)

O sistema de cache da aplicação é realizado com auxílio de um container rodando o Redis. No caso deste desafio, que temos apenas um container rodando faria mais sentido fazer o cache dentro do meu próprio servidor. No entanto, fiz o código base deste teste pensando em uma arquitetura de microsserviços, onde com certeza teríamos diversas instâncias rodando em algum orquestrador, e seria ideal se elas conseguissem compartilhar do mesmo cache, por isso o container com Redis existe, ele centraliza essa informação. Acredito que vale a pena apesar de aumentar a complexidade em questão de DevOps. 

## ESM module

Por ser um teste que nunca vai pra produção tomei a liberdade de usar um [módulo experimental](https://nodejs.org/api/esm.html) do NodeJS.

## Circle-CI

Criei um pipeline responsável por rodar os testes para toda movimentação de branches feita no git. Achei isso necessário pois para rodar todos os testes localmente é necessário um servidor Redis disponível (Para testes envolvendo cache). Caso o programador tenha algum impedimento com isso ele pode deixar esse trabalho para o pipeline, que vai rodar o Redis internamente para realizar os testes.
![pipeline](https://my-use.s3-sa-east-1.amazonaws.com/Firefox_Screenshot_2020-06-22T07-18-55.080Z.png)

## Uso do endpoint

A aplicação funciona como pedido no teste:

  Entrada:

    http://localhost:3000/repositories/:name
  
  Saída:
 
      [  
 
    {

    “name”: “repositoryA”,

    “stars”: 9

    },

     {

    “name”: “repositoryb”,

    “stars”: 1

    }

      ]

Logo, foi pedido um endpoint que recebesse o parâmetro nome  da organização e devolvesse os repositórios públicos referentes. A grande maioria das organizações possuem um número possível de trazer em apenas uma chamada, mas algumas possuem mais de 1000 repositórios por exemplo. Como não foi indicado um esquema de paginação à ser consumido pelo lado do cliente, foi setado um limite de 500 repositórios para o uso dessa API, evitando uma chamada muito longa e atendendo ao requisito especificado no documento.

## Credenciais

Não vi problemas em expôr o token em um repositório privado pra este teste.

## API V4

No teste foi inicado o uso da API V3 do Github, porém acabei escolhendo a API V4. Em um projeto real essa mudança com certeza teria sido discutida com o time, no entanto, por ser apenas um teste eu tomei a liberdade da escolha. Lembrando que minha escolha foi baseada pensando no próprio documento de especificação do teste:

- "Abstrair e otimizar ao máximo a resposta solicitada"- Content, Rock. O objeto de resposta "Repository" é muito extenso. E apesar de possuir vários dados nós estamos interessados apenas em dois deles, sendo: ['name', 'stars']. Isso me pareceu um trabalho perfeito para o GraphQL, que no caso é usado na API V4.

- "Resolução de problemas simples, porém complexos. Lembre-se, simple is better than complex"- Content, Rock. Usando a API V4 eu não teria o problema relacionado ao campo “stargazers_count” e consigo o número de stars na mesma chamada do dado nome do repositório, reduzindo o número de requisições do meu serviço. 

- "Entenda como funciona a paginação na API do GitHub" - Content, Rock. A paginação foi um dos tópicos focados no documento. A API V4 usa um sistema de paginação baseada em "cursor, edges e nodes", considerado pela própria equipe do Facebook um método extremamente assertivo de se paginar.

## Espiando o código

Temos o arquivo ./src/application.js e o arquivo .src/server.js separados.

O server.js é responsável por inicializar o server em sí e o application.js cuida de configura-lo ao setar middlewares, rotas ou qualquer outra necessidade que venha a surgir. Essa separação é tinteressante pois isolamos a aplicação e conseguimos testar os endpoints separadamente.

#### application.js:
![app](https://my-use.s3-sa-east-1.amazonaws.com/app.png)

#### server.js:
![server](https://my-use.s3-sa-east-1.amazonaws.com/server.png)


Acredito que o resto vai ser melhor analisado no próprio códio, afinal uma das minhas tarefas é codar algo intuitivo, então não acredito que seja justo com o teste eu cair em muitos detalhes, já que estamos simulando um code-review aqui.

## Modos de rodar o projeto

Caso você tenha o docker-compose instalado, tudo que precisa fazer é rodar o comando "docker-compose up" || "sudo docker-compose up".

Caso usar o docker-compose seja um impedimento pra você, configurei a aplicação de uma maneira que roda com script de start. Dessa maneira o cash vai ser desativado, removendo assim, a necessidade de ter um container rodando pelo docker-compose. Já que em um cenário real provavelmente teríamos um DB deployado em um ambiente de testes, decidi criar esse "facilitador" para a pessoa responsável por testar meu código, lembrando que isso compromete parte dos testes para fazer a aplicação rodar normalmente sem o sistema de cache.

Porém caso você consiga rodar o Redis localmente, ainda vai conseguir usar o script de start, basta alternar a config comentada no arquivo ./utils/config.js:

![config](https://my-use.s3-sa-east-1.amazonaws.com/server.png)

## Finalização

Nos diferenciais foram especificados:
- Utilização de containers Docker - e a explicação sucinta de como executá-los.
- Utilização de concorrência/paralelismo.
- Utilização de técnicas de cache.

Destes não explorei concorrência/paralelismo por não ter conseguido encontrar uma necessidade que justificasse o aumento de complexidade. Acredito que esse diferencial teria se encaixado bem caso eu tivesse usado a API V3 e precisasse organizar dados  de duas requisições simultâneamente, porém o uso da API V4 me poupou disso.

Fiz este documento com nível de detalhamento que julgo suficiente para que um desenvolvedor de nível sênior avalie, então acredito que as informações de como executar o código estão sucintas.

Obrigado pela oportunidade mais uma vez!

Good Luck and Good Code!

