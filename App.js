import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";

//UseState pega muita memoria 

export default function App() {
  const [tela, setTela] = useState("boasVindas");

  // Estados de Login
  const [emailLogin, setEmailLogin] = useState("");
  const [senhaLogin, setSenhaLogin] = useState("");

  // Estados de Cadastro
  const [nomeCadastro, setNomeCadastro] = useState("");
  const [emailCadastro, setEmailCadastro] = useState("");
  const [senhaCadastro, setSenhaCadastro] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  // Estados do Dashboard
  const [saldo, setSaldo] = useState(1850.42);
  const [mostrarSaldo, setMostrarSaldo] = useState(true);
  const [cartaoVirado, setCartaoVirado] = useState(false);

  // Modal Ativo: 'pix' | 'pagar' | 'fatura' | null
  const [modalAtivo, setModalAtivo] = useState(null);

  // Campos dos Modais
  const [nomePix, setNomePix] = useState("");
  const [chavePix, setChavePix] = useState("");
  const [valorPix, setValorPix] = useState("");
  const [codigoBoleto, setCodigoBoleto] = useState("");
  const [valorBoleto, setValorBoleto] = useState("");

  // Extrato da Fatura
  const [faturaCompras, setFaturaCompras] = useState([
    { id: "1", local: "Supermercado", valor: 142.9, data: "04/08" },
    { id: "2", local: "Restaurante", valor: 65.0, data: "05/08" },
    { id: "3", local: "Serviço de Streaming", valor: 39.9, data: "06/08" },
  ]);

  // REGEX DE VALIDAÇÃO
  const pinRegex = /^\d{4}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const nomeRegex = /^[a-zA-ZÀ-ÿ\s]+$/;

  // Regex Chave Pix
  const cpfRegex = /^(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11})$/;
  const celularRegex = /^(\+?55\s?)?(\(?\d{2}\)?\s?)?9?\d{8}$|^(\+?55\s?)?(\(?\d{2}\)?\s?)?9?\d{4}-\d{4}$/;

  // Regex Boleto (Aceita 44 dígitos do código de barras, 47 do boleto bancário ou 48 de conta de consumo)
  const boletoRegex = /^(\d{44}|\d{47}|\d{48})$/;

  const totalFatura = faturaCompras.reduce((acc, item) => acc + item.valor, 0);

  function notificar(titulo, mensagem) {
    if (Platform.OS === "web") {
      alert(`${titulo}: ${mensagem}`);
    } else {
      Alert.alert(titulo, mensagem);
    }
  }

  function handleLogin() {
    if (!emailLogin.trim() || !senhaLogin.trim()) {
      notificar("Atenção", "Preencha todos os campos para acessar.");
      return;
    }
    if (!emailRegex.test(emailLogin.trim())) {
      notificar("E-mail Inválido", "Digite um e-mail válido.");
      return;
    }
    if (!pinRegex.test(senhaLogin)) {
      notificar("PIN Inválido", "A senha PIN deve conter exatamente 4 números.");
      return;
    }
    setTela("dashboard");
  }

  function handleCadastro() {
    if (
      !nomeCadastro.trim() ||
      !emailCadastro.trim() ||
      !senhaCadastro.trim() ||
      !confirmarSenha.trim()
    ) {
      notificar("Atenção", "Preencha todos os campos.");
      return;
    }
    if (!emailRegex.test(emailCadastro.trim())) {
      notificar("E-mail Inválido", "Digite um e-mail válido.");
      return;
    }
    if (!pinRegex.test(senhaCadastro)) {
      notificar("PIN Inválido", "A senha PIN deve conter exatamente 4 números.");
      return;
    }
    if (senhaCadastro !== confirmarSenha) {
      notificar("Erro", "As senhas não coincidem.");
      return;
    }

    notificar("Sucesso", "Conta criada com sucesso!");
    setEmailLogin(emailCadastro);
    setNomeCadastro("");
    setEmailCadastro("");
    setSenhaCadastro("");
    setConfirmarSenha("");
    setTela("login");
  }

  function handleTransferirPix() {
    const valor = parseFloat(valorPix.replace(",", "."));
    const chave = chavePix.trim();

    if (!nomePix.trim() || !chave || isNaN(valor) || valor <= 0) {
      notificar("Atenção", "Preencha todos os campos do Pix corretamente.");
      return;
    }

    if (!nomeRegex.test(nomePix.trim())) {
      notificar(
        "Nome Inválido",
        "O nome do destinatário não pode conter números ou caracteres especiais."
      );
      return;
    }

    const eChaveValida =
      emailRegex.test(chave) || cpfRegex.test(chave) || celularRegex.test(chave);

    if (!eChaveValida) {
      notificar(
        "Chave Pix Inválida",
        "Informe uma chave válida: E-mail, CPF (11 dígitos) ou Celular (com DDD)."
      );
      return;
    }

    if (valor > saldo) {
      notificar("Saldo Insuficiente", "Você não possui saldo para esta transação.");
      return;
    }

    setSaldo((prev) => prev - valor);

    const novaTransacao = {
      id: Date.now().toString(),
      local: `Pix enviado: ${nomePix.trim()}`,
      valor: valor,
      data: "Hoje",
    };

    setFaturaCompras((prev) => [novaTransacao, ...prev]);

    notificar(
      "Pix Realizado",
      `R$ ${valor.toFixed(2).replace(".", ",")} transferidos para ${nomePix.trim()}!`
    );

    setNomePix("");
    setChavePix("");
    setValorPix("");
    setModalAtivo(null);
  }

  function handlePagarBoleto() {
    const valor = parseFloat(valorBoleto.replace(",", "."));
    // Remove espaços, pontos e traços digitados para validar somente os números
    const codigoApenasNumeros = codigoBoleto.replace(/[\s.-]/g, "");

    if (!codigoBoleto.trim() || isNaN(valor) || valor <= 0) {
      notificar("Atenção", "Informe o código e valor do boleto.");
      return;
    }

    // Validação do Código de Boleto por Regex
    if (!boletoRegex.test(codigoApenasNumeros)) {
      notificar(
        "Código de Boleto Inválido",
        "O código deve conter apenas números e a quantidade correta de dígitos (44, 47 ou 48 números, sem letras)."
      );
      return;
    }

    if (valor > saldo) {
      notificar("Saldo Insuficiente", "Você não possui saldo suficiente.");
      return;
    }

    setSaldo((prev) => prev - valor);

    const novaTransacao = {
      id: Date.now().toString(),
      local: "Pagamento de Boleto",
      valor: valor,
      data: "Hoje",
    };

    setFaturaCompras((prev) => [novaTransacao, ...prev]);

    notificar("Pagamento Realizado", `Boleto de R$ ${valor.toFixed(2).replace(".", ",")} pago!`);
    setCodigoBoleto("");
    setValorBoleto("");
    setModalAtivo(null);
  }

  function handleSair() {
    setEmailLogin("");
    setSenhaLogin("");
    setCartaoVirado(false);
    setTela("login");
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          {/* TELA DE BOAS-VINDAS */}
          {tela === "boasVindas" && (
            <View style={styles.cardConteudo}>
              <Text style={styles.titulo}>Bem-Vindo ao Senai Bank</Text>
              <Text style={styles.texto}>Clique para entrar na sua conta</Text>

              <TouchableOpacity
                style={styles.botao}
                onPress={() => setTela("login")}
                activeOpacity={0.8}
              >
                <Text style={styles.textoBotao}>Acesse sua conta</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* TELA DE LOGIN */}
          {tela === "login" && (
            <View style={styles.cardConteudo}>
              <Text style={styles.titulo}>Acesse sua Conta</Text>

              <TextInput
                style={styles.input}
                placeholder="E-mail"
                placeholderTextColor="#bbb"
                value={emailLogin}
                onChangeText={setEmailLogin}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TextInput
                style={styles.input}
                placeholder="Senha PIN (4 dígitos)"
                placeholderTextColor="#bbb"
                value={senhaLogin}
                onChangeText={setSenhaLogin}
                keyboardType="numeric"
                secureTextEntry
                maxLength={4}
              />

              <TouchableOpacity
                style={styles.botao}
                onPress={handleLogin}
                activeOpacity={0.8}
              >
                <Text style={styles.textoBotao}>Acessar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.botaoSecundario}
                onPress={() => setTela("cadastro")}
                activeOpacity={0.8}
              >
                <Text style={styles.textoBotaoSecundario}>
                  Não tem conta? Cadastrar
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* TELA DE CADASTRO */}
          {tela === "cadastro" && (
            <View style={styles.cardConteudo}>
              <Text style={styles.titulo}>Crie sua Conta</Text>

              <TextInput
                style={styles.input}
                placeholder="Nome completo"
                placeholderTextColor="#bbb"
                value={nomeCadastro}
                onChangeText={setNomeCadastro}
              />

              <TextInput
                style={styles.input}
                placeholder="E-mail"
                placeholderTextColor="#bbb"
                value={emailCadastro}
                onChangeText={setEmailCadastro}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TextInput
                style={styles.input}
                placeholder="Criar PIN (4 dígitos)"
                placeholderTextColor="#bbb"
                value={senhaCadastro}
                onChangeText={setSenhaCadastro}
                keyboardType="numeric"
                secureTextEntry
                maxLength={4}
              />

              <TextInput
                style={styles.input}
                placeholder="Confirmar PIN (4 dígitos)"
                placeholderTextColor="#bbb"
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                keyboardType="numeric"
                secureTextEntry
                maxLength={4}
              />

              <TouchableOpacity
                style={styles.botao}
                onPress={handleCadastro}
                activeOpacity={0.8}
              >
                <Text style={styles.textoBotao}>Finalizar Cadastro</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.botaoSecundario}
                onPress={() => setTela("login")}
                activeOpacity={0.8}
              >
                <Text style={styles.textoBotaoSecundario}>
                  Já possui conta? Voltar ao Login
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* TELA DE DASHBOARD */}
          {tela === "dashboard" && (
            <View style={styles.cardConteudo}>
              <View style={styles.headerDashboard}>
                <View>
                  <Text style={styles.saudacao}>Olá, Cliente SENAI</Text>
                  <Text style={styles.subSaudacao}>Conta Corrente</Text>
                </View>
                <TouchableOpacity style={styles.botaoSair} onPress={handleSair}>
                  <Text style={styles.textoBotaoSair}>Sair</Text>
                </TouchableOpacity>
              </View>

              {/* CARTÃO VIRTUAL */}
              <View style={styles.cartaoVirtual}>
                {!cartaoVirado ? (
                  <View style={styles.cartaoConteudo}>
                    <View style={styles.cartaoTopo}>
                      <Text style={styles.cartaoMarca}>SENAI BANK</Text>
                      <TouchableOpacity
                        onPress={() => setMostrarSaldo(!mostrarSaldo)}
                        style={styles.badgeOlho}
                      >
                        <Ionicons
                          name={mostrarSaldo ? "eye-outline" : "eye-off-outline"}
                          size={18}
                          color="#e285ff"
                        />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.cartaoSaldoArea}>
                      <Text style={styles.labelSaldo}>Saldo Disponível</Text>
                      <Text style={styles.valorSaldo}>
                        {mostrarSaldo
                          ? `R$ ${saldo.toFixed(2).replace(".", ",")}`
                          : "R$ •••••••"}
                      </Text>
                    </View>

                    <View style={styles.cartaoRodaPe}>
                      <Text style={styles.numeroCartao}>
                        •••• •••• •••• 4821
                      </Text>
                      <Text style={styles.nomeTitular}>CLIENTE SENAI</Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.cartaoConteudoVerso}>
                    <View style={styles.tarjaMagnetica} />
                    <View style={styles.cvvArea}>
                      <Text style={styles.labelCvv}>CVV</Text>
                      <View style={styles.boxCvv}>
                        <Text style={styles.textoCvv}>892</Text>
                      </View>
                    </View>
                    <Text style={styles.validadeCartao}>Validade: 12/29</Text>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.botaoGirarCartao}
                  onPress={() => setCartaoVirado(!cartaoVirado)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.textoGirarCartao}>
                    {cartaoVirado ? "Ver Frente do Cartão" : "Ver Verso (CVV)"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* AÇÕES RÁPIDAS */}
              <Text style={styles.tituloSecao}>Ações Rápidas</Text>
              <View style={styles.gridAcoes}>
                <TouchableOpacity
                  style={styles.cardAcao}
                  onPress={() => setModalAtivo("pix")}
                >
                  <View style={styles.iconeContainer}>
                    <Ionicons name="swap-horizontal" size={20} color="#e285ff" />
                    <Text style={styles.iconeFallback}>⇄</Text>
                  </View>
                  <Text style={styles.textoAcao}>Área Pix</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cardAcao}
                  onPress={() => setModalAtivo("pagar")}
                >
                  <View style={styles.iconeContainer}>
                    <Ionicons name="barcode-outline" size={20} color="#e285ff" />
                    <Text style={styles.iconeFallback}>║▌</Text>
                  </View>
                  <Text style={styles.textoAcao}>Pagar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cardAcao}
                  onPress={() => setModalAtivo("fatura")}
                >
                  <View style={styles.iconeContainer}>
                    <Ionicons name="receipt-outline" size={20} color="#e285ff" />
                    <Text style={styles.iconeFallback}>📄</Text>
                  </View>
                  <Text style={styles.textoAcao}>Fatura</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* MODAL: PIX */}
          <Modal
            visible={modalAtivo === "pix"}
            transparent
            animationType="slide"
            onRequestClose={() => setModalAtivo(null)}
          >
            <Pressable
              style={styles.modalOverlay}
              onPress={() => setModalAtivo(null)}
            >
              <Pressable
                style={styles.modalCard}
                onPress={(e) => e.stopPropagation()}
              >
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitulo}>Transferência Pix</Text>
                  <TouchableOpacity
                    style={styles.botaoFecharModal}
                    onPress={() => setModalAtivo(null)}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  >
                    <Ionicons name="close" size={22} color="#444" />
                    <Text style={styles.textoBotaoFechar}>✕</Text>
                  </TouchableOpacity>
                </View>

                <TextInput
                  style={styles.modalInput}
                  placeholder="Nome do Destinatário (apenas letras)"
                  placeholderTextColor="#aaa"
                  value={nomePix}
                  onChangeText={setNomePix}
                />

                <TextInput
                  style={styles.modalInput}
                  placeholder="Chave Pix (CPF, E-mail ou Celular)"
                  placeholderTextColor="#aaa"
                  value={chavePix}
                  onChangeText={setChavePix}
                  autoCapitalize="none"
                />

                <TextInput
                  style={styles.modalInput}
                  placeholder="Valor (R$)"
                  placeholderTextColor="#aaa"
                  value={valorPix}
                  onChangeText={setValorPix}
                  keyboardType="numeric"
                />

                <TouchableOpacity
                  style={styles.botaoModal}
                  onPress={handleTransferirPix}
                >
                  <Text style={styles.textoBotaoModal}>Confirmar Pix</Text>
                </TouchableOpacity>
              </Pressable>
            </Pressable>
          </Modal>

          {/* MODAL: PAGAR */}
          <Modal
            visible={modalAtivo === "pagar"}
            transparent
            animationType="slide"
            onRequestClose={() => setModalAtivo(null)}
          >
            <Pressable
              style={styles.modalOverlay}
              onPress={() => setModalAtivo(null)}
            >
              <Pressable
                style={styles.modalCard}
                onPress={(e) => e.stopPropagation()}
              >
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitulo}>Pagamento de Boleto</Text>
                  <TouchableOpacity
                    style={styles.botaoFecharModal}
                    onPress={() => setModalAtivo(null)}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  >
                    <Ionicons name="close" size={22} color="#444" />
                    <Text style={styles.textoBotaoFechar}>✕</Text>
                  </TouchableOpacity>
                </View>

                <TextInput
                  style={styles.modalInput}
                  placeholder="Código de Barras (somente números)"
                  placeholderTextColor="#aaa"
                  value={codigoBoleto}
                  onChangeText={setCodigoBoleto}
                  keyboardType="numeric"
                />

                <TextInput
                  style={styles.modalInput}
                  placeholder="Valor do Boleto (R$)"
                  placeholderTextColor="#aaa"
                  value={valorBoleto}
                  onChangeText={setValorBoleto}
                  keyboardType="numeric"
                />

                <TouchableOpacity
                  style={styles.botaoModal}
                  onPress={handlePagarBoleto}
                >
                  <Text style={styles.textoBotaoModal}>Pagar Agora</Text>
                </TouchableOpacity>
              </Pressable>
            </Pressable>
          </Modal>

          {/* MODAL: FATURA */}
          <Modal
            visible={modalAtivo === "fatura"}
            transparent
            animationType="slide"
            onRequestClose={() => setModalAtivo(null)}
          >
            <Pressable
              style={styles.modalOverlay}
              onPress={() => setModalAtivo(null)}
            >
              <Pressable
                style={styles.modalCard}
                onPress={(e) => e.stopPropagation()}
              >
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitulo}>Fatura Atual</Text>
                  <TouchableOpacity
                    style={styles.botaoFecharModal}
                    onPress={() => setModalAtivo(null)}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  >
                    <Ionicons name="close" size={22} color="#444" />
                    <Text style={styles.textoBotaoFechar}>✕</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.faturaHeaderInfo}>
                  <Text style={styles.faturaLabel}>Total da Fatura:</Text>
                  <Text style={styles.faturaValor}>
                    R$ {totalFatura.toFixed(2).replace(".", ",")}
                  </Text>
                </View>

                <Text style={styles.faturaSubtitulo}>Lançamentos Recentes:</Text>
                <ScrollView style={{ maxHeight: 200 }}>
                  {faturaCompras.map((item) => (
                    <View key={item.id} style={styles.faturaItem}>
                      <View>
                        <Text style={styles.faturaItemLocal}>{item.local}</Text>
                        <Text style={styles.faturaItemData}>{item.data}</Text>
                      </View>
                      <Text style={styles.faturaItemValor}>
                        R$ {item.valor.toFixed(2).replace(".", ",")}
                      </Text>
                    </View>
                  ))}
                </ScrollView>

                <TouchableOpacity
                  style={[styles.botaoModal, { marginTop: 15 }]}
                  onPress={() => setModalAtivo(null)}
                >
                  <Text style={styles.textoBotaoModal}>Fechar</Text>
                </TouchableOpacity>
              </Pressable>
            </Pressable>
          </Modal>

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

  headerDashboard: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  saudacao: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
  },

  subSaudacao: {
    fontSize: 14,
    color: "#f3d1ff",
  },

  botaoSair: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },

  textoBotaoSair: {
    color: "#ffffff",
    fontWeight: "bold",
  },

  cartaoVirtual: {
    width: "100%",
    backgroundColor: "#1a1a2e",
    borderRadius: 18,
    padding: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    marginBottom: 25,
  },

  cartaoConteudo: {
    justifyContent: "space-between",
    minHeight: 150,
  },

  cartaoTopo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cartaoMarca: {
    color: "#e285ff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1.5,
  },

  badgeOlho: {
    backgroundColor: "rgba(226, 133, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e285ff",
  },

  cartaoSaldoArea: {
    marginVertical: 12,
  },

  labelSaldo: {
    color: "#aaaaaa",
    fontSize: 12,
    textTransform: "uppercase",
  },

  valorSaldo: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 4,
  },

  cartaoRodaPe: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  numeroCartao: {
    color: "#dddddd",
    fontSize: 13,
    letterSpacing: 1,
  },

  nomeTitular: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "bold",
  },

  cartaoConteudoVerso: {
    minHeight: 150,
    justifyContent: "space-between",
  },

  tarjaMagnetica: {
    backgroundColor: "#000000",
    height: 35,
    marginHorizontal: -20,
    marginTop: -5,
  },

  cvvArea: {
    alignItems: "flex-end",
    marginTop: 10,
  },

  labelCvv: {
    color: "#aaaaaa",
    fontSize: 10,
    marginBottom: 2,
  },

  boxCvv: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },

  textoCvv: {
    color: "#000000",
    fontWeight: "bold",
    fontSize: 14,
  },

  validadeCartao: {
    color: "#aaaaaa",
    fontSize: 12,
    textAlign: "right",
  },

  botaoGirarCartao: {
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
  },

  textoGirarCartao: {
    color: "#e285ff",
    fontSize: 13,
    fontWeight: "bold",
  },

  tituloSecao: {
    width: "100%",
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 12,
  },

  gridAcoes: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cardAcao: {
    backgroundColor: "#ffffff",
    width: "30%",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },

  iconeContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#f3d1ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },

  iconeFallback: {
    color: "#e285ff",
    fontSize: 14,
    fontWeight: "bold",
    position: "absolute",
  },

  textoAcao: {
    color: "#333333",
    fontSize: 13,
    fontWeight: "bold",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  modalCard: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  modalTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
  },

  botaoFecharModal: {
    backgroundColor: "#f0f0f0",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  textoBotaoFechar: {
    color: "#444444",
    fontSize: 16,
    fontWeight: "bold",
    position: "absolute",
  },

  modalInput: {
    backgroundColor: "#f4f4f4",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#333333",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },

  botaoModal: {
    backgroundColor: "#e285ff",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 6,
  },

  textoBotaoModal: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },

  faturaHeaderInfo: {
    backgroundColor: "#f8f0fc",
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  faturaLabel: {
    color: "#666666",
    fontSize: 14,
  },

  faturaValor: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e285ff",
  },

  faturaSubtitulo: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 8,
  },

  faturaItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },

  faturaItemLocal: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333333",
  },

  faturaItemData: {
    fontSize: 12,
    color: "#999999",
  },

  faturaItemValor: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#e53935",
  },
});