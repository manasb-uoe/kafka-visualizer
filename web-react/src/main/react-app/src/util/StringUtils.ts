export default class StringUtils {

    public static markSearchTermInString(inputString: string, searchTerm: string): string {
        inputString = StringUtils.sanitizeString(inputString);

        if (!searchTerm || searchTerm.length === 0) {
            return inputString;
        }

        let markedString = '';
        const firstOccurrenceIndex = inputString.toLowerCase().indexOf(searchTerm.toLowerCase());

        for (let i = 0; i < inputString.length; i++) {
            if (i === firstOccurrenceIndex) {
                markedString += '<mark>';
            }

            if (i === firstOccurrenceIndex + searchTerm.length) {
                markedString += '</mark>';
            }

            markedString += inputString[i];
        }

        return markedString;
    }

    private static sanitizeString(content: string): string {
        return content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
}