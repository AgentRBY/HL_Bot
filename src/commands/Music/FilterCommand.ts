import { Command } from '../../structures/Command';
import { client } from '../../app';
import { ErrorEmbed, SuccessEmbed } from '../../utils/Embed';
import { AvailableFilters } from '../../static/Music';

export default new Command({
  name: 'filter',
  category: 'Music',
  aliases: [],
  description: '',
  examples: [],
  usage: 'filter',
  run: async ({ message, args }) => {
    const queue = client.disTube.getQueue(message);

    if (!queue) {
      const errorEmbed = ErrorEmbed('**Сейчас нет активных сессий**');
      return message.reply({ embeds: [errorEmbed], allowedMentions: { repliedUser: false } });
    }

    const filter = args[0];

    if (!filter) {
      const activeFilters = queue.filters.join('`, `');

      const embed = SuccessEmbed(`Текущие фильтры: \`${activeFilters || 'отсутствуют'}\``);
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    if (filter === 'list') {
      const availableFilters = Array.from(AvailableFilters).join('`, `');
      const embed = SuccessEmbed(`Доступные фильтры: \`${availableFilters}\``);
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    if (!AvailableFilters.has(filter)) {
      const embed = ErrorEmbed('Фильтр не найден');
      embed.setFooter('Что-бы узнать доступные фильтры пропишите >filters list');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    queue.setFilter(filter);

    const embed = SuccessEmbed(`Фильтр \`${filter}\` успешно применён`);
    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    return;
  },
});