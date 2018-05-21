(function (Algorithm) {
    'use strict';

    Algorithm.getExperienceFromStats = (stats) => {
        return (
            (parseInt(stats['postcount']) || 0) +
            (5 * parseInt(stats['topiccount']) || 0) +
            (10 * parseInt(stats['reputation']) || 0));
    };

    Algorithm.getLevelFromExperience = (xp) => {
        return Math.max(1.5 * Math.sqrt(xp), 1);
    };

    Algorithm.getExperienceFromLevel = (lvl) => {
        return Math.pow(lvl / 1.5, 2);
    };

    Algorithm.getInfoFromStats = (stat) => {
        const xp = Algorithm.getExperienceFromStats(stat);
        const lvl = Math.floor(Algorithm.getLevelFromExperience(xp));
        const xpNextLvl = Algorithm.getExperienceFromLevel(lvl + 1);
        const lvlXp = Algorithm.getExperienceFromLevel(lvl);
        const lvlProgress = (xp - lvlXp) / (xpNextLvl - lvlXp) * 100;
        return {
            xp, lvl, xpNextLvl, lvlXp, lvlProgress
        };
    };

})(module.exports);
