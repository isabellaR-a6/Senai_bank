import React from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native";

export default function LoginScreen({
  tela,
  setTela,
  loginForm,
  setLoginForm,
  cadastroForm,
  setCadastroForm,
  onLogin,
  onCadastro,
}) {
  if (tela === "boasVindas") {
    return (
      <View style={styles.cardConteudo}>
        <Text style={styles.titulo}>SENAI BANK</Text>
        <Text style={styles.texto}>O futuro das suas finanças em um só lugar.</Text>
        <TouchableOpacity style={styles.botao} onPress={() => setTela("login")} activeOpacity={0.8}>
          <Text style={styles.textoBotao}>Acessar Minha Conta</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (tela === "cadastro") {
    return (
      <View style={styles.cardConteudo}>
        <Text style={styles.titulo}>Crie sua Conta</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome completo"
          placeholderTextColor="#888d9a"
          value={cadastroForm.nome}
          onChangeText={(text) => setCadastroForm((prev) => ({ ...prev, nome: text }))}
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#888d9a"
          value={cadastroForm.email}
          onChangeText={(text) => setCadastroForm((prev) => ({ ...prev, email: text }))}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          textContentType="emailAddress"
        />
        <TextInput
          style={styles.input}
          placeholder="Criar PIN (4 dígitos)"
          placeholderTextColor="#888d9a"
          value={cadastroForm.senha}
          onChangeText={(text) => setCadastroForm((prev) => ({ ...prev, senha: text }))}
          keyboardType="numeric"
          secureTextEntry
          maxLength={4}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar PIN (4 dígitos)"
          placeholderTextColor="#888d9a"
          value={cadastroForm.confirmarSenha}
          onChangeText={(text) => setCadastroForm((prev) => ({ ...prev, confirmarSenha: text }))}
          keyboardType="numeric"
          secureTextEntry
          maxLength={4}
        />
        <TouchableOpacity style={styles.botao} onPress={onCadastro} activeOpacity={0.8}>
          <Text style={styles.textoBotao}>Finalizar Cadastro</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.botaoSecundario}
          onPress={() => setTela("login")}
          activeOpacity={0.8}
        >
          <Text style={styles.textoBotaoSecundario}>Já possui conta? Voltar ao Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.cardConteudo}>
      <Text style={styles.titulo}>Acesse sua Conta</Text>
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor="#888d9a"
        value={loginForm.email}
        onChangeText={(text) => setLoginForm((prev) => ({ ...prev, email: text }))}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha PIN (4 dígitos)"
        placeholderTextColor="#888d9a"
        value={loginForm.senha}
        onChangeText={(text) => setLoginForm((prev) => ({ ...prev, senha: text }))}
        keyboardType="numeric"
        secureTextEntry
        maxLength={4}
      />
      <TouchableOpacity style={styles.botao} onPress={onLogin} activeOpacity={0.8}>
        <Text style={styles.textoBotao}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.botaoSecundario}
        onPress={() => setTela("cadastro")}
        activeOpacity={0.8}
      >
        <Text style={styles.textoBotaoSecundario}>Não tem conta? Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  cardConteudo: {
    width: "100%",
    maxWidth: 360,
    alignItems: "center",
  },
  titulo: {
    fontSize: 32,
    fontWeight: "800",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  texto: {
    fontSize: 16,
    color: "#a0a5c0",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  input: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.07)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    fontSize: 16,
    color: "#ffffff",
    marginBottom: 16,
  },
  botao: {
    width: "100%",
    backgroundColor: "#e285ff",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#e285ff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  textoBotao: {
    color: "#080911",
    fontSize: 17,
    fontWeight: "bold",
  },
  botaoSecundario: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },
  textoBotaoSecundario: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
});