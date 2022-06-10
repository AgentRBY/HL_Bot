import { ErrorEmbed } from '../../../utils/Discord/Embed';
import { MessageEmbed } from 'discord.js';
import { Colors } from '../../../static/Colors';
import { Emojis } from '../../../static/Emojis';

import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';

class VolumeCommand extends CommonCommand {
  name = 'volume';
  category = 'Music';
  aliases = ['v', 'set-volume', 'громкость', 'установить-громкость'];
  description = 'Устанавливает громкость бота в процентах. По умолчанию значение громкости 50%';
  usage = 'volume <значение>';
  examples: CommandExample[] = [
    {
      command: 'volume 42',
      description: 'Устанавливает значения громкости на `42%`',
    },
    {
      command: 'volume default',
      description: 'Устанавливает значения громкости по умолчанию',
    },
  ];

  async run({ client, message, args }: CommandRunOptions) {
    const queue = client.disTube.getQueue(message);

    if (!queue) {
      const errorEmbed = ErrorEmbed('**Плейлист пуст**');
      return message.reply({ embeds: [errorEmbed], allowedMentions: { repliedUser: false } });
    }
    if (args.length && args[0] === 'default') {
      args[0] = '50';
    }

    const volume = args.length && Number.parseInt(args[0]);

    if (!volume || Number.isNaN(volume) || volume > 100 || volume < 1) {
      const errorEmbed = ErrorEmbed('**Укажите значение громкости в процентах от 1 до 100**');
      return message.reply({ embeds: [errorEmbed], allowedMentions: { repliedUser: false } });
    }

    await client.disTube.setVolume(message, volume);

    const embed = new MessageEmbed()
      .setColor(Colors.Green)
      .setDescription(`${Emojis.Microphone} **Значение громкости установлено на ${volume}**`);
    return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
  }
}

export default new VolumeCommand();