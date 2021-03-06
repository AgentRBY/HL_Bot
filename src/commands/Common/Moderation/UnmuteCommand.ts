import { SuccessEmbed } from '../../../utils/Discord/Embed';
import moment from 'moment';
import { MessageEmbed, PermissionString } from 'discord.js';
import { Emojis } from '../../../static/Emojis';
import { Colors } from '../../../static/Colors';
import { getMemberBaseId } from '../../../utils/Other';
import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';
import { getMemberFromMessage } from '../../../utils/Discord/Users';

class UnmuteCommand extends CommonCommand {
  name = 'unmute';
  category = 'Moderation';
  aliases = ['removeMute'];
  description = 'Размучивает человека, если он был замучен';
  examples: CommandExample[] = [
    {
      command: 'unmute @TestUser',
      description: 'Убирает мут у пользователя @TestUser',
    },
    {
      command: 'unmute @TestUser Ошибочный мут',
      description: 'Убирает мут у пользователя @TestUser по причине `Ошибочный мут`',
    },
  ];
  usage = 'unmute <пользователь> [причина]';
  botPermissions: PermissionString[] = ['MODERATE_MEMBERS'];
  memberPermissions: PermissionString[] = ['BAN_MEMBERS'];

  async run({ client, message, args }: CommandRunOptions) {
    const targetMember = getMemberFromMessage(message);

    if (!targetMember) {
      message.sendError('Пользователь не найден');
      return;
    }

    if (!targetMember.isCommunicationDisabled()) {
      message.sendError('Пользователь не в муте');
      return;
    }

    const reason = args.slice(1).join(' ');

    const remainingMuteTime = Date.now() - targetMember.communicationDisabledUntilTimestamp;
    const remainingMuteTimeHumanize = moment.duration(remainingMuteTime).locale('ru').humanize();

    await targetMember.timeout(null);

    const embed = SuccessEmbed(`Пользователь ${targetMember} был размучен
        Если бы не вы, ему осталось бы сидеть в муте ${remainingMuteTimeHumanize}`);
    const directEmbed = new MessageEmbed()
      .setDescription(
        `${Emojis.Info} На сервере \`${message.guild}\` Вы были размучены пользователем ${message.author}`,
      )
      .setColor(Colors.Green);

    client.service.removeMute(getMemberBaseId(targetMember), message.author.id, reason);

    if (reason) {
      embed.setFooter({ text: `Причина размута: ${reason}` });
      directEmbed.setFooter({ text: `Причина размута: ${reason}` });
    }

    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    targetMember.send({ embeds: [directEmbed] });
  }
}

export default new UnmuteCommand();
