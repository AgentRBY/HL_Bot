import { ErrorEmbed, SuccessEmbed } from '../../../utils/Discord/Embed';

import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';

class ResumeCommand extends CommonCommand {
  name = 'resume';
  category = 'Music';
  aliases = [];
  description = 'Возобновляет трек, если он остановлен';
  usage = 'resume';
  examples: CommandExample[] = [
    {
      command: 'resume',
      description: 'Возобновляет трек',
    },
  ];

  async run({ client, message }: CommandRunOptions) {
    const queue = client.disTube.getQueue(message);

    if (!queue) {
      const errorEmbed = ErrorEmbed('**Сейчас нет активных сессий**');
      return message.reply({ embeds: [errorEmbed], allowedMentions: { repliedUser: false } });
    }

    if (queue.playing) {
      const embed = ErrorEmbed('**Трек не приостановлен.**');
      return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }

    const embed = SuccessEmbed('**Трек был возобновлён.**');
    await client.disTube.resume(message);
    return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
  }
}

export default new ResumeCommand();