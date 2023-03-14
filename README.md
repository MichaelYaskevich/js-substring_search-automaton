# js-substring_search-automaton
Поиск подстроки в строке через ДКА.

Пример запуска:
js-substring_search-automaton>node src/auto.js -a -n 2 -t resources/Harry.txt resources/HarrySubStr.txt

-a, если установлен, показывается таблица переходов автомата
-n number, если установлен, то выводится number ближайших вхождений подстроки
-t, если установлен, то выводится время работы алгоритма
resources/Harry.txt - текст про Гарри Поттера
resources/HarrySubStr.txt - подстрока "Гарри"

Для примера выше будет выведен результат:
WorkTime: 15ms
  Г а р и
0)1 0 0 0
1)1 2 0 0
2)1 0 3 0
3)1 0 4 0
4)1 0 0 5
5)1 0 0 0
------First n entries-----
|            6652           |
|            7338           |
--------------------------
