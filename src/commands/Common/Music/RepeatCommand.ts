import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';
import { IsChannelForMusic } from '../../../utils/Decorators/MusicDecorators';

class RepeatCommand extends CommonCommand {
  name = 'repeat';
  category = 'Music';
  aliases = ['loop', 'rp'];
  description = `Позволяет повторить трек или плейлист. 
     Возможны три значения: 
     \`song\` - повторять только песню 
     \`queue\` - повторять весь плейлист (по умолчанию) 
     \`off\` - выключить повторение`;
  usage = 'repeat [значение]';
  examples: CommandExample[] = [
    {
      command: 'repeat',
      description: 'Включает/выключает повторение плейлиста',
    },
    {
      command: 'repeat song',
      description: 'Включает/выключает повторение песни',
    },
  ];

  @IsChannelForMusic()
  async run({ client, message, args }: CommandRunOptions) {
    const queue = client.disTube.getQueue(message);

    if (queue.repeatMode) {
      queue.setRepeatMode(0);

      message.sendSuccess('**Повторение выключено**');
      return;
    }

    const modes = ['off', 'disable', 'song', 'queue', 'playlist'];

    if (args[0] && !modes.includes(args[0])) {
      message.sendError(
        `**Неизвестный тип, пожалуйста укажите один из этих типов:**
        \`song\` - повторять только песню 
        \`queue\` - повторять весь плейлист (по умолчанию) 
        \`off\` - выключить повторение
        `,
      );
      return;
    }

    const mode = args[0] || '';
    let modeCode = 2;
    let modeMessage = '**Установлено повторения всего плейлиста**';

    if (mode === 'off' || mode === 'disable') {
      modeCode = 0;
      modeMessage = '**Повторение выключено**';
    }
    if (mode === 'song') {
      modeCode = 1;
      modeMessage = '**Установлено повторение песни**';
    }

    queue.setRepeatMode(modeCode);

    message.sendSuccess(modeMessage);
  }
}

export default new RepeatCommand();
