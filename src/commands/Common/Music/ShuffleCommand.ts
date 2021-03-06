import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';
import { IsChannelForMusic } from '../../../utils/Decorators/MusicDecorators';

class ShuffleCommand extends CommonCommand {
  name = 'shuffle';
  category = 'Music';
  aliases = ['random'];
  description = 'Перемешивает песни в плейлисте';
  examples: CommandExample[] = [
    {
      command: 'shuffle',
      description: 'Перемешивает песни в плейлисте',
    },
  ];
  usage = 'shuffle';

  @IsChannelForMusic()
  async run({ client, message }: CommandRunOptions) {
    const queue = client.disTube.getQueue(message);

    await queue.shuffle();

    message.sendSuccess('**Плейлист перемешан**');
    return;
  }
}

export default new ShuffleCommand();
