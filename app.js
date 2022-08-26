// Require the necessary discord.js classes
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const axios = require('axios')
require('dotenv').config()

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});


client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;
    var licenseClass;
    var address;

	if (commandName === 'callsign') {
        var call = interaction.options.getString('input');
        if(/^[AaWaKkNn][a-zA-Z]?[0-9][a-zA-Z]{1,3}$/.test(call.toUpperCase())) {
            await axios.get(`https://hamcall.dev/${call}.json`)
                .then(function (response) {
                    switch(response.data.class) {
                        case 'E':
                            licenseClass = "Amateur Extra";
                            break;
                        case 'G':
                            licenseClass = 'General';
                            break;
                        case 'T':
                            licenseClass = 'Technician';
                            break;
                    }

                    if(response.data.po_box) {
                        address = `P.O. BOX ${response.data.po_box} \n ${response.data.city} ${response.data.state}, ${response.data.zip}`
                    } else {
                        address = `${response.data.address} \n ${response.data.city} ${response.data.state}, ${response.data.zip}`
                    }

                    const callEmbed = new EmbedBuilder()
                        .setTitle(call.toUpperCase())
                        .addFields(
                            { name: 'Name', value: `${response.data.first_name} ${response.data.last_name}` },
                            { name: 'Class', value: licenseClass },
                            { name: 'Address', value: address },
                            { name: 'Last LOTW Upload', value: response.data.last_lotw }
                        )
                    interaction.reply({ embeds: [callEmbed] })
                })
        } else {
            await interaction.reply("Please enter a valid US call.")
        }
    }
});

// Login to Discord with your client's token
client.login(process.env.BOT_TOKEN);

/*

if(args.length === 0) {
            return "Please input a callsign."
        } if(/^[AaWaKkNn][a-zA-Z]?[0-9][a-zA-Z]{1,3}$/.test(args[0].toUpperCase())) {
            msg.channel.createMessage({content: })
        } else {
            return 'Please input a valid US callsign.'
        }


*/