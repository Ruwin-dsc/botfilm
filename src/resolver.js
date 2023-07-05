import Discord from "discord.js";


//////////////////////////////////////
//  UTILS
//////////////////////////////////////


String.prototype.contains = function (queries) {

    // Check if string contains one of queries.
    for (let query of queries)
        if (this.includes(query))
            return true;

    return false;
};


//////////////////////////////////////
//  RESOLVER
//////////////////////////////////////


export default {
    yqy : Discord.Util,
    resolveEmoji            : Discord.Util.parseEmoji,
    resolveButtonStyle      : function resoleButtonStyle(string) { return string; },
}
