import { _decorator, Animation, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Spin')
export class Spin extends Component {
    @property({type: Animation})
    symbolAnim: Animation | null = null;


    start() {

    }
    
    setGameActive(active: boolean){
        if (active){

        }
        else{

        }
    }

    update(deltaTime: number) {
        
    }
}


