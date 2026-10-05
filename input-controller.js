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
            console.log("bindActions вызван с:", actionsToBind);
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

            this.target = null;
            this.enabled = false;

            this.target.removeEventListener('keydown', this._onKeyDown);
            this.target.removeEventListener('keyup', this._onKeyUp);
        }

        _onKeyDown(e) {
            console.log('Нажата клавиша', e.keyCode);
        }

        _onKeyUp(e){
            console.log('Отжата клавиша', e.keyCode);
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