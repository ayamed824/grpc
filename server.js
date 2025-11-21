import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from "url";

// Required for __dirname with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load proto file
const PROTO_PATH = path.join(__dirname, "proto/email.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const emailProto = grpc.loadPackageDefinition(packageDefinition).email;

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "ayamed200355@gmail.com",       // ← ton Gmail
    pass: "jyfdephqecvkgbji"              // ← mot de passe d’application (sans espaces)
  }
});

// Function to send email
function sendPromoEmail(call, callback) {
  const { to, subject, message } = call.request;

  transporter.sendMail(
    { from: "ayamed200355@gmail.com", to, subject, text: message },
    (error, info) => {
      if (error) return callback(null, { success: false, info: error.toString() });
      callback(null, { success: true, info: "Email envoyé !" });
    }
  );
}


// Start gRPC Server
function main() {
  const server = new grpc.Server();
  server.addService(emailProto.EmailService.service, {
    SendPromoEmail: sendPromoEmail
  });

  const address = "0.0.0.0:50051";
  server.bindAsync(address, grpc.ServerCredentials.createInsecure(), () => {
    console.log("🚀 gRPC Server running on " + address);
  });
}

main();
