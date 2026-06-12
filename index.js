const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("DGoatBot est en ligne !");
});

// IMPORTANT Render port
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("Serveur web lancé sur le port " + PORT);
});

const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder
} = require("discord.js");

// 🤖 BOT
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// 🔐 CONFIG
const CLIENT_ID = "1511794170614911106";
const GUILD_ID = "1500223164481802471";
const TOKEN = process.env.TOKEN;

// 🔧 MAINTENANCE MODE
let maintenance = false;

// 📌 COMMANDES
const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Répond pong"),

  new SlashCommandBuilder()
    .setName("roll")
    .setDescription("Lance un dé"),

  new SlashCommandBuilder()
    .setName("say")
    .setDescription("Le bot répète ton message")
    .addStringOption(option =>
      option.setName("message")
        .setDescription("Message à envoyer")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("maintenance")
    .setDescription("Active ou désactive le mode maintenance")
    .addBooleanOption(option =>
      option.setName("etat")
        .setDescription("true = ON / false = OFF")
        .setRequired(true)
    )
].map(cmd => cmd.toJSON());

// 🚀 REGISTER COMMANDS
const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {
    console.log("Enregistrement des commandes...");

    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );

    console.log("Commandes enregistrées !");
  } catch (err) {
    console.error(err);
  }
})();

// 💬 MESSAGE FUN
client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  // bloque si maintenance
  if (maintenance) return;

  const replies = [
    "Hmm intéressant 👀",
    "Ok ok 😄",
    "Je vois 🤔",
    "Stylé 🔥",
    "Explique plus"
  ];

  if (Math.random() < 0.12) {
    message.reply(replies[Math.floor(Math.random() * replies.length)]);
  }
});

// ⚙️ INTERACTIONS
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  // 🔧 BLOCK MAINTENANCE (admins only bypass)
  if (maintenance && !interaction.member.permissions.has("Administrator")) {
    return interaction.reply({
      content: "🔧 BOT EN PHASE DE MISE À JOUR MERCI DE NE PAS M'UTILISER POUR FAIRE DES COMMANDES",
      ephemeral: true
    });
  }

  // PING
  if (interaction.commandName === "ping") {
    return interaction.reply("🏓 pong !");
  }

  // ROLL
  if (interaction.commandName === "roll") {
    const result = Math.floor(Math.random() * 6) + 1;
    return interaction.reply(`🎲 ${result}`);
  }

  // SAY
  if (interaction.commandName === "say") {
    const msg = interaction.options.getString("message");
    return interaction.reply(msg);
  }

  // MAINTENANCE COMMAND
  if (interaction.commandName === "maintenance") {
    if (!interaction.member.permissions.has("Administrator")) {
      return interaction.reply({
        content: "❌ Tu n’as pas la permission admin",
        ephemeral: true
      });
    }

    maintenance = interaction.options.getBoolean("etat");

    return interaction.reply(
      maintenance
        ? "🔧 Mode maintenance ACTIVÉ"
        : "🟢 Mode maintenance DÉSACTIVÉ"
    );
  }
});

// 🤖 READY EVENT (version clean)
client.on("ready", () => {
  console.log(`🟢 Bot connecté en tant que ${client.user.tag}`);
});

// 🔌 LOGIN
client.login(TOKEN);
