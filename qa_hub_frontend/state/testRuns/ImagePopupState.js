import {makeAutoObservable} from "mobx";

class ImagePopupState {
  isOpen = false
  imageSrc = null

  open(imageSrc) {
    this.imageSrc = imageSrc
    this.isOpen = true
  }

  close() {
    this.imageSrc = null
    this.isOpen = false
  }
  setIsOpen(value) {
    this.isOpen = value
  }

  constructor() {
    makeAutoObservable(this)
  }
}

export default new ImagePopupState()