/*
 * This file is part of Discord Whitelist Bot.
 *
 * Discord Whitelist Bot is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Discord Whitelist Bot is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Discord Whitelist Bot.  If not, see <https://www.gnu.org/licenses/>.
 */

const { userMention, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");
const config = require("../../../config/config")

module.exports = {
    id: 'whitelist_application_reject_button',
    async execute(interaction, client) {
        const modal = new ModalBuilder()
            .setCustomId('whitelist_application_reject_modal')
            .setTitle('Nhập lý do từ chối');

        const reasonInput = new TextInputBuilder()
            .setCustomId('reason_input')
            .setLabel('Nhập lý do:')
            .setPlaceholder("Ví dụ: Trả lời không đầy đủ, không rõ ràng...")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        const row = new ActionRowBuilder().addComponents(reasonInput);
        modal.addComponents(row);

        await interaction.showModal(modal);
    }
}