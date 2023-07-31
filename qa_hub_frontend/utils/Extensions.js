String.prototype.substringAfter = function(substring) {
    return this.substring(this.indexOf(substring))
}

String.prototype.substringAfterLast = function(substring) {
    return this.substring(this.lastIndexOf(substring))
}

String.prototype.substringBeforeLast = function(substring) {
    return this.substring(0, this.lastIndexOf(substring))
}

String.prototype.substringBefore = function(substring) {
    return this.substring(0, this.indexOf(substring))
}

String.prototype.cut = function(maxSymbols) {
    if (this.length > maxSymbols) {
        return this.slice(0, maxSymbols - 3) + "..."
    }
    return this
}