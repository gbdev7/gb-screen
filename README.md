# 🖥️ GB Screen

### Plataforma de Compartilhamento de Tela em Tempo Real

![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![WebRTC](https://img.shields.io/badge/WebRTC-Tempo_Real-333333?style=for-the-badge)
![LiveKit](https://img.shields.io/badge/LiveKit-Real--Time_Media-00A9E0?style=for-the-badge&logo=livekit&logoColor=white)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)

O **GB Screen** é uma aplicação web desenvolvida para permitir o compartilhamento de tela em tempo real diretamente pelo navegador, facilitando a transmissão de conteúdo para outros participantes sem a necessidade de instalar um programa dedicado.

O projeto utiliza uma arquitetura com frontend e backend separados, integrando uma API desenvolvida em Java com a infraestrutura de comunicação em tempo real do LiveKit.

Mais do que uma interface para compartilhar telas, o GB Screen representa uma experiência prática com integração de serviços, autenticação, transmissão de mídia e implantação de aplicações em ambientes de nuvem.

🔗 **Aplicação:** [Acessar o GB Screen](https://gb-screen.vercel.app/)

📂 **Repositório:** [github.com/gbdev7/gb-screen](https://github.com/gbdev7/gb-screen)

---

## ✨ Funcionalidades

- **Compartilhamento de tela:** captura da tela selecionada pelo usuário por meio dos recursos nativos do navegador.
- **Transmissão em tempo real:** utilização de infraestrutura baseada em WebRTC para comunicação de áudio e vídeo.
- **Integração com LiveKit:** conexão de participantes a salas de comunicação mediante tokens de acesso.
- **Arquitetura separada:** organização independente do frontend e do backend.
- **Implantação em nuvem:** frontend hospedado na Vercel e backend hospedado no Render.

## 🛠️ Tecnologias e ferramentas

### Backend

- **Java 21:** linguagem utilizada no desenvolvimento da lógica do servidor.
- **Spring Boot 3:** framework para construção e configuração da API backend.
- **API REST:** comunicação entre o frontend e o backend.
- **LiveKit Server SDK:** integração com o serviço de comunicação em tempo real, incluindo a geração de tokens de acesso.

### Frontend

- **React:** construção da interface utilizando componentes reutilizáveis.
- **TypeScript:** tipagem estática para melhorar a organização, a manutenção e a confiabilidade do código.
- **Vite:** ferramenta de desenvolvimento e compilação da aplicação frontend.
- **APIs de mídia do navegador:** recursos utilizados para solicitar e capturar a tela selecionada pelo usuário.

### Comunicação em tempo real

- **LiveKit:** gerenciamento de salas, conexão de participantes e transmissão de mídia.
- **WebRTC:** tecnologia para comunicação de áudio e vídeo em tempo real.

### Infraestrutura e ferramentas

- **Vercel:** hospedagem e publicação do frontend.
- **Render:** hospedagem e execução do backend.
- **Git e GitHub:** controle de versão e gerenciamento do código-fonte.

## 🏗️ Arquitetura da aplicação

A aplicação separa a interface do usuário, as responsabilidades do servidor e a infraestrutura de transmissão em componentes distintos.

1. **Frontend:** o usuário inicia o compartilhamento e autoriza o navegador a capturar a tela selecionada.
2. **Backend:** a API realiza as operações necessárias de autorização e gera os tokens de acesso ao LiveKit.
3. **LiveKit:** o cliente utiliza o token autorizado para se conectar à sala e publicar o fluxo de mídia.
4. **Participantes:** os usuários conectados recebem a transmissão por meio da infraestrutura de comunicação em tempo real.

Essa organização permite manter as credenciais sensíveis no backend e separar a lógica da aplicação do transporte de mídia.

## 🧠 Desafios técnicos e aprendizados

Um dos principais desafios durante o desenvolvimento foi diagnosticar uma falha que impedia o início da transmissão após a seleção da tela.

A investigação envolveu a análise do console do navegador, erros HTTP `401 Unauthorized`, conexões WebSocket e validação dos tokens de acesso do LiveKit.

A resolução exigiu investigar o fluxo de autenticação e conexão entre os diferentes componentes, demonstrando a importância de acompanhar uma requisição desde sua origem até o estabelecimento da conexão em tempo real.

Entre os conhecimentos aplicados e desenvolvidos durante o projeto, destacam-se:

- Integração entre frontend e backend.
- Autenticação e autorização em serviços de comunicação em tempo real.
- Diagnóstico de falhas em conexões WebSocket.
- Integração com tecnologias de transmissão baseadas em WebRTC.
- Configuração de variáveis de ambiente em serviços de nuvem.
- Depuração de aplicações implantadas em produção.
- Integração entre serviços independentes em uma arquitetura distribuída.

## 🎯 Objetivo do projeto

O GB Screen foi desenvolvido com o objetivo de explorar a construção de uma aplicação funcional de compartilhamento de tela, aprofundando conhecimentos em desenvolvimento web, integração de APIs, comunicação em tempo real e infraestrutura em nuvem.

O projeto faz parte da minha evolução como desenvolvedor, buscando transformar conhecimentos técnicos em aplicações reais, resolver problemas de implementação e compreender como diferentes tecnologias trabalham juntas para entregar uma solução completa.

## 👨‍💻 Desenvolvedor

**Gabriel Pereira da Silva**

- GitHub: [@gbdev7](https://github.com/gbdev7)

---

*Projeto desenvolvido com foco em desenvolvimento full stack, comunicação em tempo real e infraestrutura em nuvem.*
