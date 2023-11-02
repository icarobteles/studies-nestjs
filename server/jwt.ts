// EXEMPLO DE GERAÇÃO DE TOKEN UTILIZANDO APENAS NODE (e DOTENV)

import { createHmac } from "node:crypto";
import "dotenv/config";

/* ========================== INTERFACES ================================= */
interface IHeader {
  alg: string; // Algoritmo de assinatura (HS256 neste exemplo).
  typ: string; // Tipo do token (JWT neste caso).
}

interface IPayload {
  fullname: string;
  username: string;
  exp: number; // Timestamp de expiração do token.
  iat: number; // Timestamp de emissão do token.
}

type ISecretKey = string; // Chave secreta para assinatura do token.
/* ====================================================================== */

/* =============================== DATAS ================================ */
const THIRTY_MIN_IN_MILLISECONDS = 30 * 60 * 1000; // 30 minutos em milisegundos
const currentDateTime = new Date().getTime(); // Obtém o timestamp atual.
const expirationDateTime = currentDateTime + THIRTY_MIN_IN_MILLISECONDS; // Corresponde a 30 minutos à frente do momento atual
/* ====================================================================== */

/* ================== PARTES DO TOKEN ===================== */
const header: IHeader = {
  alg: "HS256",
  typ: "JWT",
};

const payload: IPayload = {
  fullname: "John Doe",
  username: "johndoe",
  iat: currentDateTime,
  exp: expirationDateTime,
};

const secretKey: ISecretKey = process.env.JWT_SECRET_KEY;
/* ======================================================= */

// Função para codificar uma string em base64url.
function encodeInBase64url(value: string): string {
  return Buffer.from(value).toString("base64url");
}

// Função para criar a assinatura do token usando HMAC-SHA256
function createSignature(
  headerEncoded: string,
  payloadEncoded: string,
  secretKey: string,
): string {
  return createHmac("sha256", secretKey)
    .update(`${headerEncoded}.${payloadEncoded}`)
    .digest("base64url");
}

// Função para gerar o token JWT completo.
function generateToken(
  header: IHeader,
  payload: IPayload,
  secretKey: ISecretKey,
): string {
  const headerEncoded: string = encodeInBase64url(JSON.stringify(header));
  const payloadEncoded: string = encodeInBase64url(JSON.stringify(payload));
  const signature = createSignature(headerEncoded, payloadEncoded, secretKey);

  const token = `${headerEncoded}.${payloadEncoded}.${signature}`;
  return token;
}

// Geração do token JWT completo e exibição no console.
const myToken = generateToken(header, payload, secretKey);
console.log(myToken);
