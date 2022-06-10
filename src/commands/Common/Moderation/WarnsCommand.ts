import { SuccessEmbed } from '../../../utils/Discord/Embed';
import { MessageEmbed } from 'discord.js';
import moment from 'moment';
import { Colors } from '../../../static/Colors';
import { momentToDiscordDate } from '../../../utils/Common/Date';
import { getMemberBaseId } from '../../../utils/Other';
import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';

class WarnsCommand extends CommonCommand {
  name = 'warns';
  category = 'Moderation';
  aliases = [];
  description = 'Выводит список всех предупреждений пользователя.';
  examples: CommandExample[] = [
    {
      command: 'warns @TestUser',
      description: 'Выводит список всех предупреждений пользователя TestUser.',
    },
  ];
  usage = 'warn [пользователь]';

  async run({ client, message }: CommandRunOptions) {
    const targetMember = message.mentions.members.first() || message.member;

    const warns = await client.service.getWarns(getMemberBaseId(targetMember));

    if (!warns.length) {
      const embed = SuccessEmbed('Предупреждения отсутствуют');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const embed = new MessageEmbed()
      .setColor(Colors.Blue)
      .addFields(
        warns.map((warn, index) => ({
          name: `Предупреждение №${index + 1}`,
          value: `**Выдан:** ${message.guild.members.cache.get(warn.givenBy) || 'Неизвестно'}
                **Причина:** ${warn.reason || 'Отсутствует'}
                **Время:** ${momentToDiscordDate(moment(warn.date))}
                ${
                  warn.removed
                    ? `
                **Был снят:** Да
                **Снят пользователем:** ${message.guild.members.cache.get(warn.removedBy) || 'Неизвестно'}
                **Время снятия:** ${momentToDiscordDate(moment(warn.removedDate))}
                ${warn.removedReason ? `**Причина снятия:** ${warn.removedReason}` : ''}`
                    : ''
                }`,
          inline: true,
        })),
      )
      .setFooter({
        text: `Карма за предупреждения: ${await client.service.calculateWarnsKarma(getMemberBaseId(targetMember))}`,
      });

    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
  }
}

export default new WarnsCommand();