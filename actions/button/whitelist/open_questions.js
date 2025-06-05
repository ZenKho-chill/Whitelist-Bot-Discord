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

const { ActionRowBuilder, TextInputBuilder,ModalBuilder } = require("discord.js");
const questions = require("../../modal/whitelist/questions");
const config = require("../../../config/config");

module.exports = {
    id: 'whitelist_open_questions_button',
    async execute(interaction) {

        const modal = new ModalBuilder()
            .setCustomId(questions.id)
            .setTitle(config.whitelist.modal_title)

        config.whitelist.questions.slice(0, 5).forEach(question => {
            const input = new TextInputBuilder()
                .setCustomId(question.key)
                .setLabel(question.question)
                .setStyle(question.type)
                .setPlaceholder(question.placeholder)
                .setRequired(question.required);

            const actionRow = new ActionRowBuilder().addComponents(input);
            modal.addComponents(actionRow);
        });

        await interaction.showModal(modal);
    }
}