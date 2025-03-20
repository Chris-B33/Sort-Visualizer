# Sorting Algorithm Visualizer

<a href="https://htmlpreview.github.io/?https://github.com/Chris-B33/sort-visualizer/blob/main/index.html"><img alt="Static Badge" src="https://img.shields.io/badge/Preview-Application"></a>

## Description

This application shows a way to visualize different sorting algorithms.
It is written in native JavaScript, no additional libraries were used.<br>
I wanted to make this project after seeing many videos online about visualizing different sorting algorithms and I wanted to make my own version.<br>
"In-place" algorithms like Bubble and Insertion Sort were quite trivial to implemement.<br>
However, "Divide and Conquer" algorithms such as Merge Sort, where we have to keep track of sub-arrays were more difficult as keeping the position of the elements in the overall array was complicated.

## Implemented Algorithms
| Algorithm | | | Time Complexity | | | Space Complexity |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| | | Best Case | Average Case | Worst Case | | Worst Case |
**Bubble Sort**      | | `Ω(n)` | `Θ(n²)` | `O(n²)` | | `O(1)` |
**Insertion Sort**   | | `Ω(n)` | `Θ(n²)` | `O(n²)` | | `O(1)` |
**Selection Sort**   | | `Ω(n²)` | `Θ(n²)` | `O(n²)` | | `O(1)` |
**Cocktail Sort**    | | `Ω(n²)` | `Θ(n²)` | `O(n²)` | | `O(1)` | 
**Pancake Sort**     | | `Ω(n²)` | `Θ(n²)` | `O(n²)` | | `O(1)` |
**Shell Sort**       | | `Ω(n log(n))` | `Θ(n log²(n))` | `O(n log²(n))` | | `O(1)` |
**Quick Sort**       | | `Ω(n log(n))` | `Θ(n log(n))` | `O(n²)` | | `O(Log(n))` |
**Merge Sort**       | | `Ω(n log(n))` | `Θ(n log(n))` | `O(n log(n))` | | `O(N)` |
**Heap Sort**        | | `Ω(n log(n))` | `Θ(n log(n))` | `O(n log(n))` | | `O(1)` 
**Bucket Sort**      | | `Ω(n+k)` | `Θ(n+k)` | `O(n²)` | | `O(n)` |
**Radix Sort**       | | `Ω(nk)` | `Θ(nk)` | `O(nk)` | | `O(n+k)` |


## Installation

It is not required to download this repository to run the application. 
Opening <a href="https://htmlpreview.github.io/?https://github.com/Chris-B33/sort-visualizer/blob/main/index.html">this link</a> will bring you to a HTML preview through Github to run it.
<br>
However, if you want to use it offline, download as a zip or clone the repository. You can then open index.html to play.
