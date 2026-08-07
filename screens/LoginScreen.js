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
        <Text style={styles.titulo}>Bem-Vindo ao Senai Bank</Text>
        <Text style={styles.texto}>Clique para entrar na sua conta</Text>
        <TouchableOpacity style={styles.botao} onPress={() => setTela("login")} activeOpacity={0.8}>
          <Text style={styles.textoBotao}>Acesse sua conta</Text>
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
          placeholderTextColor="#bbb"
          value={cadastroForm.nome}
          onChangeText={(text) => setCadastroForm((prev) => ({ ...prev, nome: text }))}
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#bbb"
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
          placeholderTextColor="#bbb"
          value={cadastroForm.senha}
          onChangeText={(text) => setCadastroForm((prev) => ({ ...prev, senha: text }))}
          keyboardType="numeric"
          secureTextEntry
          maxLength={4}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar PIN (4 dígitos)"
          placeholderTextColor="#bbb"
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
        placeholderTextColor="#bbb"
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
        placeholderTextColor="#bbb"
        value={loginForm.senha}
        onChangeText={(text) => setLoginForm((prev) => ({ ...prev, senha: text }))}
        keyboardType="numeric"
        secureTextEntry
        maxLength={4}
      />
      <TouchableOpacity style={styles.botao} onPress={onLogin} activeOpacity={0.8}>
        <Text style={styles.textoBotao}>Acessar</Text>
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
    fontSize: 34,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 20,
  },
  texto: {
    fontSize: 18,
    color: "#ffffff",
    textAlign: "center",
    lineHeight: 26,
    marginBottom: 30,
  },
  input: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    fontSize: 16,
    color: "#333333",
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  botao: {
    width: "100%",
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  textoBotao: {
    color: "#e285ff",
    fontSize: 18,
    fontWeight: "bold",
  },
  botaoSecundario: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
    borderWidth: 1.5,
    borderColor: "#ffffff",
  },
  textoBotaoSecundario: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});