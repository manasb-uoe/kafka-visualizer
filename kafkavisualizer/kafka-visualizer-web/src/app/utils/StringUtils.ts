import {Injectable} from "@angular/core";

@Injectable()
export class StringUtils {

  public static markSearchTermInString(inputString: string, searchTerm: string): string {
    if (!searchTerm || searchTerm.length === 0) {
      return inputString;
    }

    let markedString = "";

    const firstOccurrenceIndex = inputString.toLowerCase().indexOf(searchTerm.toLowerCase());

    for (let i = 0; i < inputString.length; i++) {
      if (i === firstOccurrenceIndex) {
        markedString += "<kbd>";
      }

      if (i === firstOccurrenceIndex + searchTerm.length) {
        markedString += "</kbd>";
      }

      markedString += inputString[i];
    }

    return markedString;
  }
}
