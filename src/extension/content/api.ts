import { from, Observable, switchMap } from "rxjs";

type GetAnimal = 'cat' | 'dog'
const apiGetAnimal = (type: GetAnimal) => `https://functions.yandexcloud.net/d4em56i1nd2og00usj96?animal=${type}`;

export const getAnimal = (type: GetAnimal): Observable<string> => {
  return from(fetch(apiGetAnimal(type))).pipe(
    switchMap(response => response.text())
  )
}
