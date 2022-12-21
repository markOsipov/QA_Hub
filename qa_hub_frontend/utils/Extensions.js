String.prototype.substringAfter = function(substring) {
    return this.substring(this.indexOf(substring))
}

String.prototype.substringAfterLast = function(substring) {
    return this.substring(this.lastIndexOf(substring))
}