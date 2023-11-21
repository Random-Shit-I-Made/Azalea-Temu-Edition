import moment from './moment';
// let configOptions = {
//     "Server": {
//         "icon": "textures/ui/servers",
//         "options": [
//             {
//                 "label": "Server Name",
//                 "type": "text-input",
//                 "key": "ServerName",
//                 "placeholder": "Type a server name"
//             },
//             {
//                 "label": "Server Description",
//                 "type": "text-input",
//                 "key": "ServerDescription",
//                 "placeholder": "Type a server description"
//             },
//             {
//                 "label": "Welcome message enabled?",
//                 "type": "toggle",
//                 "key": "WelcomeMessageEnabled"
//             },
//             {
//                 "label": "Welcome message text\n§e( [@username] = joined user )",
//                 "type": "text-input",
//                 "key": "ServerWelcomeMessage",
//                 "placeholder": "Type a welcome message"
//             }
//         ]
//     },
//     "General": {
//         "icon": "textures/ui/settings_glyph_color_2x",
//         "options": [
//             {
//                 "label": "Permission system",
//                 "type": "dropdown",
//                 "key": "PermissionSystem",
//                 "keyOptions": ["v2", "legacy"],
//                 "cliOptions": ["V2", "Legacy"]
//             }
//         ]
//     },
//     "Staffchat": {
//         "icon": "textures/ui/permissions_op_crown",
//         "options": [
//             {
//                 "label": "View global messages while in staffchat",
//                 "type": "toggle",
//                 "key": "ViewGlobalSC"
//             },
//             {
//                 "label": "Log joins/leaves",
//                 "type": "toggle",
//                 "key": "LogJoinsLeavesSC"
//             }
//         ]
//     },
//     "Experiments": {
//         "icon": "textures/gui/newgui/settings/radio_checked",
//         "options": [
//             {
//                 "label": "Enable experimental commands §c(Rquires Reload)",
//                 "type": "toggle",
//                 "key": "ExperimentalCommands"
//             },
//             {
//                 "label": "Enable command permission system §c(Rquires Reload)",
//                 "type": "toggle",
//                 "key": "CommandPermSystem"
//             },
//             {
//                 "label": "Improved Nametags",
//                 "type": "toggle",
//                 "key": "ImprovedNametagsEnabled"
//             }
//         ]
//     },
//     "Verification": {
//         "icon": "textures/ui/realms_slot_check",
//         "options": [
//             {
//                 "label": "Enable verification",
//                 "type": "toggle",
//                 "key": "EnableVerification"
//             },
//             {
//                 "label": "Verification Type",
//                 "type": "dropdown",
//                 "key": "VerificationType",
//                 "keyOptions": ["private", "public"],
//                 "cliOptions": ["Private (Requires Code + Command)", "Public (Requires Command)"]
//             },
//             {
//                 "label": "Verification Code (Requires private verification type)",
//                 "type": "text-input",
//                 "key": "VerificationCode",
//                 "placeholder": "Type a verification code"
//             }
//         ]
//     },
//     "Players": {
//         "type": "hardcoded-playermenu"
//     },
//     "Misc": {
//         options: [
//             {
//                 type: "dropdown",
//                 label: "Azalea Conditional Language Version",
//                 key: "AzaleaConditionalLanguageVersion",
//                 keyOptions: ["v1", "experimental"],
//                 cliOptions: ["V1", "Experimental"]
//             }
//         ]
//     }
// }

import { system } from '@minecraft/server';
import { PLAYER_REPORTS } from './adminpanel/reports';
import { REVIEWS } from './adminpanel/reviews';
import { TAGCMD_UI } from './adminpanel/tagcmd_ui';
import { ADMIN_TEST } from './adminpanel/test';
import { Database } from './db';
import { ActionForm } from './form_func';
import { POLLS } from './adminpanel/polls';
import { LB } from './adminpanel/leaderboardthemes';

/*
    "Misc": {
        options: [
            {
                type: "dropdown",
                label: "Azalea Conditional Language Version",
                key: "AzaleaConditionalLanguageVersion",
                keyOptions: ["v1", "experimental"],
                cliOptions: ["V1", "Experimental"]
            }
        ]
    }
}
*/

export class ConfiguratorBase {
    constructor() {
        this.options = {};
    }
    addSub(submenu) {
        this.options[submenu.name] = {
            options: submenu.options,
            icon: submenu.icon,
            type: submenu.type
        }
        return this;
    }
    toOptions() {
        return this.options;
    }
}

export class ConfiguratorSub {
    constructor(name, icon = null) {
        this.name = name;
        this.icon = icon;
        this.options = [];
        this.type = 'normal';
    }
    setCallback(fn) {
        this.type = 'func';
        this.options = [ { fn } ];
        return this;
    }
    addTextInput(key, label, placeholder) {
        this.options.push({
            type: 'text-input',
            key: key,
            label,
            placeholder
        });
        console.log(this.options)
        return this;
    }
    addDropdown(key, options, keys, label) {
        this.options.push({
            type: 'dropdown',
            keyOptions: keys,
            cliOptions: options,
            label,
            key
        });
        return this;
    }
    addToggle(key, label) {
        this.options.push({
            type: 'toggle',
            label,
            key
        })
        return this;
    }
}

export function handleConfigurator(configuratorBase) {
    if(configuratorBase instanceof ConfiguratorBase) {
        let opts = configuratorBase.toOptions();
        let actionForm = new ActionForm();
        for(const key of Object.keys(opts)) {
            actionForm.button(key, null, (player)=>{
                let ui = opts[key]
                if(ui.type == 'func')
                    return ui.options[0].fn(player);
                if(ui.type == 'hardcoded-playermenu')
                    return;
                for(const option of ui.options) {
                    // if(option.type == "")
                }
            })
        }
    }
}

let base = new ConfiguratorBase()
    .addSub(
        new ConfiguratorSub("§bServer\n§8Configure the server options", "azalea_icons/6")
            .addToggle("WelcomeMessageEnabled", "Welcome message enabled?")
            .addTextInput("ServerWelcomeMessage", "Welcome message text, remember: §d[@username] §r= joined user ", "Type a welcome message.")
    )
    .addSub(PLAYER_REPORTS())
base.options["§2Players\n§8Manage players"] = {
    "type": "hardcoded-playermenu",
    "icon": "azalea_icons/8"
}
export const baseConfigMenu = base.toOptions();

system.run(()=>{
    let configuratorDb = new Database("Config");
    configuratorDb.tableVars = {
        "AZALEA_VERSION": "%%AZALEA_VER%%",
        "NOW": Date.now().toString(),
        "BUILDTIME": `${moment(/*BUILDTIME*/).format('MMMM Do YYYY, h:mm:ss a [UTC]')}`
    }
})