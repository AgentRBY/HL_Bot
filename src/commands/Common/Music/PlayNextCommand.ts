import { MessageEmbed } from 'discord.js';
import { EmojisLinks } from '../../../static/Emojis';
import { Colors } from '../../../static/Colors';
import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';
import { IsUserInVoice } from '../../../utils/Decorators/MusicDecorators';

class PlayNextCommand extends CommonCommand {
  name = 'playNext';
  category = 'Music';
  aliases = ['pn'];
  description = `Проиграть трек следующим в очереди. Во всем остальном аналогичен команде >play. 
     Имеет ключ -S, который позволяет сразу пропускать текущую песню при добавлении`;
  examples: CommandExample[] = [
    {
      command: 'playNext Never Gonna Give You Up',
      description: 'Добавляет `Never Gonna Give You Up` от `Rick Astley` следующим в очередь',
    },
    {
      command: 'playNext Never Gonna Give You Up -S',
      description: 'Добавляет `Never Gonna Give You Up` от `Rick Astley` следующим в очередь и пропускает текущий трек',
    },
  ];
  usage = 'playNext <запрос>';

  @IsUserInVoice()
  async run({ client, message, args, attributes }: CommandRunOptions) {
    if (!args.length) {
      message.sendError('**Вы не указали запрос**');
      return;
    }

    const skipSong = attributes.has('S') || attributes.has('s');
    await client.disTube.play(message.member.voice.channel, args.join(' '), {
      position: 1,
      skip: skipSong,
    });

    const queue = client.disTube.getQueue(message);
    if (skipSong && queue.songs.length > 1) {
      const addedSong = queue.songs[1];

      const embed = new MessageEmbed()
        .setAuthor({ name: 'Музыка', iconURL: EmojisLinks.Music })
        .setDescription(`Трек **${addedSong.name}** был добавлен в плейлист и текущая песня **пропущена**`)
        .setFooter({ text: `Длительность: ${addedSong.formattedDuration}` })
        .setColor(Colors.Green);
      return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }
  }
}

export default new PlayNextCommand();
