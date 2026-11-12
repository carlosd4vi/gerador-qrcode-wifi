# 📱 Gerador de QR Code para Wi-Fi

Este documento descreve a estrutura, o funcionamento e as lógicas aplicadas no projeto **Gerador de QR Code Wi-Fi**. O sistema permite criar rapidamente um código QR que os smartphones podem escanear para se conectar automaticamente a uma rede Wi-Fi, sem a necessidade de digitar senhas.

---

## 📸 Demonstração da Interface

![Visão Geral da Interface do Gerador](https://archive.org/download/interface_qrcode/interface_qrcode.PNG)

---

## 🎯 Objetivo e Funcionalidades

O aplicativo web foi desenvolvido para ser simples, responsivo (com foco no uso mobile) e 100% seguro (nenhum dado de rede é salvo em bancos de dados do criador). 

**Principais Recursos:**
- Geração instantânea de QR Code via API externa (QRServer).
- Suporte para redes WPA/WPA2/WPA3, WEP e redes sem senha.
- Opção para configurar redes ocultas (Hidden SSID).
- Visualização de senha (toggle de visibilidade).
- Botões de download do QR Code em alta resolução (PNG e SVG).
- Função de **Impressão de Plaquinha** otimizada para estabelecimentos comerciais.

---

## ⚙️ Como funciona "Por Baixo dos Panos"

O aplicativo captura as informações digitadas pelo usuário e as transforma em uma *string* (linha de texto) no padrão universal reconhecido por leitores de QR Code de iOS e Android.

### O Padrão Universal
A sintaxe gerada obedece o seguinte formato:
```text
WIFI:S:<NomeDaRede>;T:<TipoDeSeguranca>;P:<Senha>;H:<Oculta>;;
```

### Arquitetura de Código
O projeto é um sistema de arquivo único (Single File) construído com:
- **HTML5:** Estrutura semântica.
- **Tailwind CSS (via CDN):** Estilização da interface de forma responsiva, utilizando um tema moderno com cores padronizadas.
- **JavaScript Vanilla:** Toda a lógica de interação na tela.

---

## 🧠 Lógica do JavaScript (Core)

Todo o comportamento dinâmico está encapsulado em uma IIFE (*Immediately Invoked Function Expression*) chamada `initWifiGenerator()`. Abaixo estão as principais responsabilidades do script:

### 1. Construção do Payload (`updatePayload`)
Sempre que o usuário digita algo, a função lê os dados, limpa os espaços em branco e monta a string oficial. Essa string é exibida em tempo real na tela para conferência do usuário.

### 2. Integração com a API do QR Code (`renderizarQRCodeAPI`)
O projeto consome a API gratuita `api.qrserver.com`. 
A imagem `<img id="qr-image">` tem seu atributo `src` atualizado dinamicamente. O JavaScript utiliza a função `encodeURIComponent()` para garantir que senhas com caracteres especiais (`#`, `&`, `+`) não quebrem a requisição URL.

```javascript
// Exemplo simplificado da integração:
const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(payloadStr)}`;
qrImage.src = apiUrl;
```

### 3. Melhorias de UX no Mobile
- Ao clicar no botão "Gerar QR Code" em dispositivos menores que 1024px, a tela utiliza a função `.scrollIntoView()` para rolar suavemente até a visualização do QR Code gerado, entregando feedback imediato ao usuário.

### 4. Lógica de Download Seguro
Em vez de simplesmente usar `<a href="...">`, o script usa a API `fetch()` para fazer o download das imagens (PNG ou SVG). Isso converte o arquivo em um `Blob` (Objeto Binário), permitindo forçar o download localmente sem que o navegador do usuário tente abrir a imagem em uma nova guia.

---

## 🖨️ Módulo de Impressão

Para facilitar a vida de pequenos comércios, o projeto possui um botão "Imprimir Plaquinha". 
O JavaScript copia o nome da rede, a senha e clona a imagem gerada (o nó do DOM da tag `<img>`) para um bloco oculto no HTML (`<div id="print-sheet">`). Este bloco utiliza classes utilitárias do Tailwind (`print:flex`) para aparecer e formatar a tela perfeitamente apenas quando o `window.print()` é chamado.

---

## 🚀 Como Executar o Projeto

1. Baixe o arquivo `index.html`.
2. Abra-o diretamente em qualquer navegador moderno (Chrome, Edge, Safari, Firefox).
3. Não é necessário configurar servidores (Node, Apache) para rodar o core do projeto localmente.

---
*Documentação gerada e atualizada com base na versão v2.4 Offline.*
