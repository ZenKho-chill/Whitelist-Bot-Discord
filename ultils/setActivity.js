/*
 * Tệp này là một phần của Whitelist Bot Discord.
 *
 * Whitelist Bot Discord là phần mềm miễn phí: bạn có thể phân phối lại hoặc sửa đổi
 * theo các điều khoản của Giấy phép Công cộng GNU được công bố bởi
 * Tổ chức Phần mềm Tự do, phiên bản 3 hoặc (nếu bạn muốn) bất kỳ phiên bản nào sau đó.
 *
 * Whitelist Bot Discord được phân phối với hy vọng rằng nó sẽ hữu ích,
 * nhưng KHÔNG CÓ BẢO HÀNH; thậm chí không bao gồm cả bảo đảm
 * VỀ TÍNH THƯƠNG MẠI hoặc PHÙ HỢP CHO MỘT MỤC ĐÍCH CỤ THỂ. Xem
 * Giấy phép Công cộng GNU để biết thêm chi tiết.
 *
 * Bạn sẽ nhận được một bản sao của Giấy phép Công cộng GNU cùng với Whitelist Bot Discord.
 * Nếu không, hãy xem <https://www.gnu.org/licenses/>.
 */

const axios = require('axios');
const config = require('../config/config');
const { ActivityType } = require('discord.js');
require('colors');

const serverInfoUrl = `http://${config.activity.fivem.ip}:${config.activity.fivem.port}/dynamic.json`;

const updatePlayerCount = (client, seconds) => {
    let playerCount;
    let retryCount = 0;
    const maxRetries = 5;

    const setStatus = () => {
        if (retryCount >= maxRetries) {
            console.error('Max retries reached. Stopping attempts to fetch server information.'.red);
            return;
        }

        axios.get(serverInfoUrl)
            .then((response) => {
                if (response.status === 200) {
                    const serverInfo = response.data;
                    if (serverInfo.clients !== undefined) {
                        playerCount = `${serverInfo.clients}/${serverInfo.sv_maxclients} Players`;
                        client.user.setActivity(`${playerCount}`, { type: ActivityType.Watching });
                        retryCount = 0; // Reset retry count on success
                    } else {
                        console.error('Player count not found in server info.');
                    }
                } else {
                    console.error('Failed to retrieve server information. Status code:', response.status);
                    retryCount++;
                }
            })
            .catch((error) => {
                console.log(`The system is trying to fetch ${process.env.serverIP}:${process.env.serverPort}, but can't reach the destination. Please change the STATUS value in the .env file to false if you don't want to use the status.`.red);
                console.error('Error fetching server information:'.red, error.message.red);
                retryCount++;
            });
    };

    setInterval(setStatus, seconds * 1000);
};

module.exports = {
    updatePlayerCount
};
