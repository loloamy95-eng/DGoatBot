const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("DGoatBot est en ligne !");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Serveur web lancé sur le port ${PORT}`);
});

// =====================
// DISCORD BOT
// =====================

const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require("discord.js");

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

// =====================
// SLASH COMMANDS
// =====================

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
    .setName("blague")
    .setDescription("Raconte une blague"),

  new SlashCommandBuilder()
    .setName("8ball")
    .setDescription("Pose une question à la boule magique")
    .addStringOption(option =>
      option.setName("question")
        .setDescription("Ta question")
        .setRequired(true)
    )
].map(cmd => cmd.toJSON());

// =====================
// ENREGISTREMENT COMMANDES
// =====================

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

// =====================
// EVENTS FUN
// =====================

client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  const replies = [
    "Hmm intéressant 👀",
    "Je vois ça 🤔",
    "Ok ok 😄",
    "Explique plus",
    "Stylé ça 🔥"
  ];

  if (Math.random() < 0.12) {
    message.reply(replies[Math.floor(Math.random() * replies.length)]);
  }
});

// =====================
// INTERACTIONS
// =====================

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    return interaction.reply("🏓 pong !");
  }

  if (interaction.commandName === "roll") {
    const result = Math.floor(Math.random() * 6) + 1;
    return interaction.reply(`🎲 Tu as fait ${result}`);
  }

  if (interaction.commandName === "say") {
    const msg = interaction.options.getString("message");
    return interaction.reply(msg);
  }

  if (interaction.commandName === "blague") {
    const jokes = [
      "Pourquoi les plongeurs plongent toujours en arrière ? Parce que sinon ils tombent dans le bateau 😂",
      "Je connais une blague sur le JavaScript… mais elle est undefined 🤣",
      "T’es tellement lent que même ton ombre t’a quitté 💀"
    ];
    return interaction.reply(jokes[Math.floor(Math.random() * jokes.length)]);
  }

  if (interaction.commandName === "8ball") {
    const answers = [
      "Oui 👍",
      "Non ❌",
      "Peut-être 🤔",
      "100% oui 🔥",
      "Impossible 💀",
      "Je ne sais pas 👀"
    ];

    return interaction.reply(
      answers[Math.floor(Math.random() * answers.length)]
    );
  }
});

// =====================
// READY
// =====================

client.on("ready", () => {
  console.log(`🟢 Bot connecté en tant que ${client.user.tag}`);
});

// =====================
// LOGIN
// =====================

client.login(TOKEN);
