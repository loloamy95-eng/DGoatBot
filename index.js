const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require("discord.js");

// 🤖 Bot client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// 🔐 Variables (IMPORTANT: pas de token ici)
const CLIENT_ID = "1511794170614911106";
const GUILD_ID = "1500223164481802471";
const TOKEN = process.env.TOKEN;

// 📌 Slash commands
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
    )
].map(cmd => cmd.toJSON());

// 🚀 Enregistrement des commandes
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

// 💬 Messages random (optionnel fun)
client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  const responses = [
    "Intéressant 👀",
    "Hmm 🤔",
    "Ok ok 😄",
    "Explique un peu plus",
    "Je vois 👀"
  ];

  if (Math.random() < 0.15) {
    const reply = responses[Math.floor(Math.random() * responses.length)];
    message.reply(reply);
  }
});

// 🤖 Slash commands
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    return interaction.reply("🏓 pong !");
  }

  if (interaction.commandName === "roll") {
    const result = Math.floor(Math.random() * 6) + 1;
    return interaction.reply(`🎲 ${result}`);
  }

  if (interaction.commandName === "say") {
    const msg = interaction.options.getString("message");
    return interaction.reply(msg);
  }
});

// 🔌 Bot ready
client.on("ready", () => {
  console.log(`🟢 Bot connecté en tant que ${client.user.tag}`);
});

// 🚀 Login
client.login(TOKEN);