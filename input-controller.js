const InputController = (function () {
    class Controller {
        constructor(actionsToBind, target = document) {
            this.enabled = true;
            this.focused = true;
            this.ACTION_ACTIVATED = "input-controller:action-activated";
            this.ACTION_DEACTIVATED = "input-controller:action-deactivated";

            this.target = null; 

            this._onKeyDown = this._onKeyDown.bind(this);
            this._onKeyUp = this._onKeyUp.bind(this)

            this.actions = {};

            this.pressedKeys = []; // коды клавиш
            this.activeActions = []; // название активных действий

            if (Object.keys(actionsToBind).length > 0) {
                this.bindActions(actionsToBind);
            }
            
            if (target) {
                this.attach(target);
            }

            window.addEventListener('focus', this._onWindowFocus);
            window.addEventListener('blur', this._onWindowBlur);
        }

        bindActions(actionsToBind) {
            for (let actionName in actionsToBind) {
                let newConfig = actionsToBind[actionName];

                if (!this.actions[actionName]){
                    this.actions[actionName] = {
                        keys: [],
                        enabled: true,
                    };
                }
                
                if (newConfig.keys) {
                    for ( let i = 0; i < newConfig.keys.length; i++) {
                        let keyCode = newConfig.keys[i];
                        let currentKeys = this.actions[actionName].keys;    

                        if (!currentKeys.includes(keyCode)) {
                            currentKeys.push(keyCode);
                        }
                    }
                }
            }
        }

        attach(target, dontEnable = false) {

            if(this.target){
                this.detach();
            }

            this.target = target;
            this.enabled = !dontEnable;
            this.target.addEventListener('keydown', this._onKeyDown);
            this.target.addEventListener('keyup', this._onKeyUp);
        }

        detach() {
            if (this.target) {
                this.target.removeEventListener('keydown', this._onKeyDown);
                this.target.removeEventListener('keyup', this._onKeyUp);
                this.target = null;

            }
            this.enabled = false;
        }
        
        _onKeyDown(e) {
            console.log('Нажата клавиша', e.keyCode);

            if (!this.enabled || !this.focused) return;

            let keyCode = e.keyCode;

            if (!this.pressedKeys.includes(keyCode)) {
                this.pressedKeys.push(keyCode);
            }
            this._evaulateActions();
        }

        _onKeyUp(e){
            console.log('Отжата клавиша', e.keyCode);

            if (!this.enabled || !this.focused) return;

            let keyCode = e.keyCode;

            this.pressedKeys = this.pressedKeys.filter(function(key) {
                return key !== keyCode;
            });

            this._evaulateActions();
        }


        _evaulateActions() {
            for (let actionName in this.actions) {
                let actionConfig = this.actions[actionName];

                if (!actionConfig.enabled) continue;

                let isPressed = false;
                for (let i = 0; i < actionConfig.keys.length; i++) {
                    let keyCode = actionConfig.keys[i];
                    if (this.pressedKeys.includes(keyCode)) {
                        isPressed = true;
                        break;
                    }
                }
                let wasAction = this.activeActions.includes(actionName);

                if (isPressed && !wasAction) {
                    this.activeActions.push(actionName);
                    this._dispatchEvent(this.ACTION_ACTIVATED, actionName);
                }

                if (!isPressed && wasAction) {
                    this.activeActions = this.activeActions.filter(function(name) {
                        return name !== actionName;
                    });

                    this._dispatchEvent(this.ACTION_DEACTIVATED, actionName);
                }    
            }
        }

        _dispatchEvent(eventName, actionName) {
            if (!this.target) return;

            let event = new CustomEvent(eventName, {
                detail: {action : actionName}
            });

            this.target._dispatchEvent(event);
        }

        _onWindowFocus() {
            console.log("Окно получило фокус");
            this.focused = true;
        }

        _onWindowBlur() {
            console.log("Окно потеряло фокус");
            this.focused = false;
        }

    }

    return Controller;
})();