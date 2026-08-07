import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Pressable,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function DashboardScreen({
  saldo,
  mostrarSaldo,
  setMostrarSaldo,
  onSair,
  modalAtivo,
  setModalAtivo,
  pixForm,
  setPixForm,
  boletoForm,
  setBoletoForm,
  faturaCompras,
  totalFatura,
  handleTransferirPix,
  handlePagarBoleto,
  fecharModal,
}) {
  const [cartaoVirado, setCartaoVirado] = useState(false);

  return (
    <View style={styles.cardConteudo}>
      <View style={styles.headerDashboard}>
        <View>
          <Text style={styles.saudacao}>Olá, Cliente SENAI</Text>
          <Text style={styles.subSaudacao}>Conta Corrente</Text>
        </View>
        <TouchableOpacity style={styles.botaoSair} onPress={onSair}>
          <Text style={styles.textoBotaoSair}>Sair</Text>
        </TouchableOpacity>
      </View>

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
                {mostrarSaldo ? `R$ ${saldo.toFixed(2).replace(".", ",")}` : "R$ •••••••"}
              </Text>
            </View>

            <View style={styles.cartaoRodaPe}>
              <Text style={styles.numeroCartao}>•••• •••• •••• 4821</Text>
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

      <Text style={styles.tituloSecao}>Ações Rápidas</Text>
      <View style={styles.gridAcoes}>
        <TouchableOpacity style={styles.cardAcao} onPress={() => setModalAtivo("pix")}>
          <View style={styles.iconeContainer}>
            <Ionicons name="swap-horizontal" size={20} color="#e285ff" />
          </View>
          <Text style={styles.textoAcao}>Área Pix</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cardAcao} onPress={() => setModalAtivo("pagar")}>
          <View style={styles.iconeContainer}>
            <Ionicons name="barcode-outline" size={20} color="#e285ff" />
          </View>
          <Text style={styles.textoAcao}>Pagar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cardAcao} onPress={() => setModalAtivo("fatura")}>
          <View style={styles.iconeContainer}>
            <Ionicons name="receipt-outline" size={20} color="#e285ff" />
          </View>
          <Text style={styles.textoAcao}>Fatura</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalAtivo === "pix"} transparent animationType="slide" onRequestClose={fecharModal}>
        <Pressable style={styles.modalOverlay} onPress={fecharModal}>
          <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>Transferência Pix</Text>
              <TouchableOpacity style={styles.botaoFecharModal} onPress={fecharModal}>
                <Ionicons name="close" size={22} color="#444" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.modalInput}
              placeholder="Nome do Destinatário (apenas letras)"
              placeholderTextColor="#aaa"
              value={pixForm.nome}
              onChangeText={(text) => setPixForm((prev) => ({ ...prev, nome: text }))}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Chave Pix (CPF, E-mail ou Celular)"
              placeholderTextColor="#aaa"
              value={pixForm.chave}
              onChangeText={(text) => setPixForm((prev) => ({ ...prev, chave: text }))}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Valor (R$)"
              placeholderTextColor="#aaa"
              value={pixForm.valor}
              onChangeText={(text) => setPixForm((prev) => ({ ...prev, valor: text }))}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.botaoModal} onPress={handleTransferirPix}>
              <Text style={styles.textoBotaoModal}>Confirmar Pix</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={modalAtivo === "pagar"} transparent animationType="slide" onRequestClose={fecharModal}>
        <Pressable style={styles.modalOverlay} onPress={fecharModal}>
          <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>Pagamento de Boleto</Text>
              <TouchableOpacity style={styles.botaoFecharModal} onPress={fecharModal}>
                <Ionicons name="close" size={22} color="#444" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.modalInput}
              placeholder="Código de Barras (somente números)"
              placeholderTextColor="#aaa"
              value={boletoForm.codigo}
              onChangeText={(text) => setBoletoForm((prev) => ({ ...prev, codigo: text }))}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Valor do Boleto (R$)"
              placeholderTextColor="#aaa"
              value={boletoForm.valor}
              onChangeText={(text) => setBoletoForm((prev) => ({ ...prev, valor: text }))}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.botaoModal} onPress={handlePagarBoleto}>
              <Text style={styles.textoBotaoModal}>Pagar Agora</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={modalAtivo === "fatura"} transparent animationType="slide" onRequestClose={fecharModal}>
        <Pressable style={styles.modalOverlay} onPress={fecharModal}>
          <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>Fatura Atual</Text>
              <TouchableOpacity style={styles.botaoFecharModal} onPress={fecharModal}>
                <Ionicons name="close" size={22} color="#444" />
              </TouchableOpacity>
            </View>
            <View style={styles.faturaHeaderInfo}>
              <Text style={styles.faturaLabel}>Total da Fatura:</Text>
              <Text style={styles.faturaValor}>R$ {totalFatura.toFixed(2).replace(".", ",")}</Text>
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
            <TouchableOpacity style={[styles.botaoModal, { marginTop: 15 }]} onPress={fecharModal}>
              <Text style={styles.textoBotaoModal}>Fechar</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  cardConteudo: {
    width: "100%",
    maxWidth: 360,
    alignItems: "center",
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