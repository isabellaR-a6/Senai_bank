import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";

import LoginScreen from "./screens/LoginScreen";
import DashboardScreen from "./screens/DashboardScreen";

const PIN_REGEX = /^\d{4}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const NOME_REGEX = /^[a-zA-ZÀ-ÿ\s]+$/;
const CPF_REGEX = /^(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11})$/;
const CELULAR_REGEX = /^(\+?55\s?)?(\(?\d{2}\)?\s?)?9?\d{8}$|^(\+?55\s?)?(\(?\d{2}\)?\s?)?9?\d{4}-\d{4}$/;
const BOLETO_REGEX = /^(\d{44}|\d{47}|\d{48})$/;

export default function App() {
  const [tela, setTela] = useState("boasVindas");

  const [loginForm, setLoginForm] = useState({ email: "", senha: "" });
  const [cadastroForm, setCadastroForm] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });

  const [saldo, setSaldo] = useState(1850.42);
  const [mostrarSaldo, setMostrarSaldo] = useState(true);

  const [modalAtivo, setModalAtivo] = useState(null);
  const [pixForm, setPixForm] = useState({ nome: "", chave: "", valor: "" });
  const [boletoForm, setBoletoForm] = useState({ codigo: "", valor: "" });

  const [faturaCompras, setFaturaCompras] = useState([
    { id: "1", local: "Supermercado", valor: 142.9, data: "04/08" },
    { id: "2", local: "Restaurante", valor: 65.0, data: "05/08" },
    { id: "3", local: "Serviço de Streaming", valor: 39.9, data: "06/08" },
  ]);

  const totalFatura = faturaCompras.reduce((acc, item) => acc + item.valor, 0);

  function notificar(titulo, mensagem) {
    if (Platform.OS === "web") {
      alert(`${titulo}: ${mensagem}`);
    } else {
      Alert.alert(titulo, mensagem);
    }
  }

  function fecharModal() {
    setModalAtivo(null);
    setPixForm({ nome: "", chave: "", valor: "" });
    setBoletoForm({ codigo: "", valor: "" });
  }

  function handleLogin() {
    if (!loginForm.email.trim() || !loginForm.senha.trim()) {
      notificar("Atenção", "Preencha todos os campos para acessar.");
      return;
    }
    if (!EMAIL_REGEX.test(loginForm.email.trim())) {
      notificar("E-mail Inválido", "Digite um e-mail válido.");
      return;
    }
    if (!PIN_REGEX.test(loginForm.senha)) {
      notificar("PIN Inválido", "A senha PIN deve conter exatamente 4 números.");
      return;
    }
    setTela("dashboard");
  }

  function handleCadastro() {
    const { nome, email, senha, confirmarSenha } = cadastroForm;

    if (!nome.trim() || !email.trim() || !senha.trim() || !confirmarSenha.trim()) {
      notificar("Atenção", "Preencha todos os campos.");
      return;
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      notificar("E-mail Inválido", "Digite um e-mail válido.");
      return;
    }
    if (!PIN_REGEX.test(senha)) {
      notificar("PIN Inválido", "A senha PIN deve conter exatamente 4 números.");
      return;
    }
    if (senha !== confirmarSenha) {
      notificar("Erro", "As senhas não coincidem.");
      return;
    }

    notificar("Sucesso", "Conta criada com sucesso!");
    setLoginForm((prev) => ({ ...prev, email }));
    setCadastroForm({ nome: "", email: "", senha: "", confirmarSenha: "" });
    setTela("login");
  }

  function handleTransferirPix() {
    const valor = parseFloat(pixForm.valor.replace(",", "."));
    const chave = pixForm.chave.trim();
    const nome = pixForm.nome.trim();

    if (!nome || !chave || isNaN(valor) || valor <= 0) {
      notificar("Atenção", "Preencha todos os campos do Pix corretamente.");
      return;
    }

    if (!NOME_REGEX.test(nome)) {
      notificar("Nome Inválido", "O nome não pode conter números ou caracteres especiais.");
      return;
    }

    const eChaveValida = EMAIL_REGEX.test(chave) || CPF_REGEX.test(chave) || CELULAR_REGEX.test(chave);

    if (!eChaveValida) {
      notificar("Chave Pix Inválida", "Informe uma chave válida: E-mail, CPF ou Celular.");
      return;
    }

    if (valor > saldo) {
      notificar("Saldo Insuficiente", "Você não possui saldo para esta transação.");
      return;
    }

    setSaldo((prev) => prev - valor);
    setFaturaCompras((prev) => [
      { id: Date.now().toString(), local: `Pix enviado: ${nome}`, valor, data: "Hoje" },
      ...prev,
    ]);

    notificar("Pix Realizado", `R$ ${valor.toFixed(2).replace(".", ",")} transferidos para ${nome}!`);
    fecharModal();
  }

  function handlePagarBoleto() {
    const valor = parseFloat(boletoForm.valor.replace(",", "."));
    const codigoApenasNumeros = boletoForm.codigo.replace(/[\s.-]/g, "");

    if (!boletoForm.codigo.trim() || isNaN(valor) || valor <= 0) {
      notificar("Atenção", "Informe o código e valor do boleto.");
      return;
    }

    if (!BOLETO_REGEX.test(codigoApenasNumeros)) {
      notificar("Código Inválido", "O código deve conter 44, 47 ou 48 números.");
      return;
    }

    if (valor > saldo) {
      notificar("Saldo Insuficiente", "Você não possui saldo suficiente.");
      return;
    }

    setSaldo((prev) => prev - valor);
    setFaturaCompras((prev) => [
      { id: Date.now().toString(), local: "Pagamento de Boleto", valor, data: "Hoje" },
      ...prev,
    ]);

    notificar("Pagamento Realizado", `Boleto de R$ ${valor.toFixed(2).replace(".", ",")} pago!`);
    fecharModal();
  }

  function handleSair() {
    setLoginForm({ email: "", senha: "" });
    setTela("login");
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          {tela === "dashboard" ? (
            <DashboardScreen
              saldo={saldo}
              mostrarSaldo={mostrarSaldo}
              setMostrarSaldo={setMostrarSaldo}
              onSair={handleSair}
              modalAtivo={modalAtivo}
              setModalAtivo={setModalAtivo}
              pixForm={pixForm}
              setPixForm={setPixForm}
              boletoForm={boletoForm}
              setBoletoForm={setBoletoForm}
              faturaCompras={faturaCompras}
              totalFatura={totalFatura}
              handleTransferirPix={handleTransferirPix}
              handlePagarBoleto={handlePagarBoleto}
              fecharModal={fecharModal}
            />
          ) : (
            <LoginScreen
              tela={tela}
              setTela={setTela}
              loginForm={loginForm}
              setLoginForm={setLoginForm}
              cadastroForm={cadastroForm}
              setCadastroForm={setCadastroForm}
              onLogin={handleLogin}
              onCadastro={handleCadastro}
            />
          )}
          <StatusBar style="light" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e285ff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});