# Senai Bank — Aplicativo Móvel

Aplicação móvel simuladora de serviços bancários, desenvolvida em **React Native** com a plataforma **Expo**.

O projeto oferece uma interface interativa para navegação entre telas de acesso, gerenciamento de conta corrente, cartão virtual dinâmico e execução de transações, contando com **validações rigorosas de dados por meio de Expressões Regulares (Regex)**.

---

## Funcionalidades

### Acesso e Autenticação

* **Tela de Boas-Vindas:** direcionamento do fluxo de navegação.
* **Tela de Login:** validação de e-mail e senha no formato de PIN numérico.
* **Tela de Cadastro:** criação de novos usuários com validação de confirmação de senha.

### Painel Principal — Dashboard

* Exibição de saudações e dados da conta corrente.
* Alternância de visibilidade do saldo disponível, permitindo **mostrar/ocultar** o valor.
* Cartão virtual interativo com recurso de **rotação**, exibindo frente e verso.
* Exibição do **CVV** no verso do cartão.

### Módulos de Transação

#### Área Pix

* Envio de transferências bancárias.
* Dedução do valor transferido em tempo real no saldo disponível.
* Validação dos dados da chave Pix.

#### Pagamento de Boletos

* Pagamento de títulos bancários.
* Registro automático do lançamento na fatura.

#### Fatura Atual

* Listagem dinâmica dos lançamentos realizados.
* Soma automatizada do valor total acumulado.

---

## Acessibilidade e Usabilidade

* Modais com fechamento ao clicar na área externa (**Overlay**).
* Suporte à navegação nativa.
* Sistema de ícones com tratamento para garantir uma visualização adequada em dispositivos móveis.
* Interface desenvolvida com foco em uma navegação simples e intuitiva.

---

## Regras de Validação — Regex

O aplicativo utiliza **Expressões Regulares (Regex)** para garantir a integridade e o formato correto dos dados inseridos pelo usuário.

| Campo                   | Regra                                          | Expressão Regular                                    |            |            |
| ----------------------- | ---------------------------------------------- | ---------------------------------------------------- | ---------- | ---------- |
| **PIN / Senha**         | Exatamente 4 dígitos numéricos                 | `/^\d{4}$/`                                          |            |            |
| **E-mail**              | Formato padrão de endereço de e-mail           | `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/` |            |            |
| **Nome**                | Apenas letras, incluindo acentuação, e espaços | `/^[a-zA-ZÀ-ÿ\s]+$/`                                 |            |            |
| **Chave Pix (CPF)**     | 11 dígitos ou formato `000.000.000-00`         | `/^(\d{3}.\d{3}.\d{3}-\d{2}                          | \d{11})$/` |            |
| **Chave Pix (Celular)** | Número com DDD, aceitando `+55` e formatação   | `/^(\+?55\s?)?(\(?\d{2}\)?\s?)?9?\d{8}$/`            |            |            |
| **Código de Boleto**    | 44, 47 ou 48 números, sem letras               | `/^(\d{44}                                           | \d{47}     | \d{48})$/` |

---

## Tecnologias Utilizadas

| Tecnologia                        | Utilização                                   |
| --------------------------------- | -------------------------------------------- |
| **React Native**                  | Desenvolvimento da interface nativa móvel    |
| **Expo**                          | Construção, testes e execução do projeto     |
| **@expo/vector-icons (Ionicons)** | Renderização dos ícones da interface         |
| **JavaScript (ES6+)**             | Lógica da aplicação e manipulação de estados |
| **Regex**                         | Validação e integridade dos dados inseridos  |

---

## Como Executar o Projeto

### Pré-requisitos

Antes de iniciar, certifique-se de possuir:

* Node.js instalado na máquina.
* Expo Go instalado no dispositivo móvel (Android/iOS) ou um emulador configurado.
* Git instalado para clonar o repositório.

### 1. Clonar o repositório

```bash
git clone https://github.com/usuario/senai-bank.git
cd senai-bank
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Iniciar o servidor de desenvolvimento

```bash
npx expo start
```

### 4. Executar no dispositivo

1. Abra o aplicativo **Expo Go** no celular.
2. Escaneie o código QR exibido no terminal ou no navegador.
3. Aguarde o carregamento da aplicação.

---

## Estrutura do Código

A aplicação possui uma arquitetura centralizada baseada em estados no arquivo principal **`App.js`**.

### Principais estados

| Estado          | Responsabilidade                                                                         |
| --------------- | ---------------------------------------------------------------------------------------- |
| `tela`          | Controla a navegação entre as telas de Boas-Vindas, Login, Cadastro e Dashboard.         |
| `modalAtivo`    | Gerencia a abertura e o fechamento dos modais de Pix, pagamento e fatura.                |
| `saldo`         | Mantém o valor disponível da conta e é atualizado conforme as transações são realizadas. |
| `faturaCompras` | Armazena e mantém os lançamentos financeiros realizados pelo usuário.                    |

---

## Objetivo do Projeto

O **Senai Bank** foi desenvolvido com o objetivo de aplicar conhecimentos de **desenvolvimento mobile, gerenciamento de estados, criação de interfaces interativas e validação de dados**, simulando funcionalidades comuns encontradas em aplicativos bancários.

O projeto também permite praticar conceitos de **UX/UI, lógica de programação, validações com Regex e desenvolvimento de aplicações utilizando React Native e Expo**.
