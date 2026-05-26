import { makeAutoObservable } from 'mobx';

class MediaStore {

    medias = [
        {
            id: 'retail-future',
            img: '/imgs/projects/1.png',
            href: '#',
        },
        {
            id: 'loyalty-campaigns',
            img: '/imgs/projects/1.png',
            href: '#',
        },
        {
            id: 'building-art-nation',
            img: '/imgs/projects/1.png',
            href: '#',
        },
        {
            id: 'european-expansion',
            img: '/imgs/projects/1.png',
            href: '#',
        },
        {
            id: 'brand-licensing',
            img: '/imgs/projects/1.png',
            href: '#',
        },
        {
            id: 'creative-business',
            img: '/imgs/projects/1.png',
            href: '#',
        }
    ]


    constructor() {
        makeAutoObservable(this);
    }


}

export default new MediaStore();
