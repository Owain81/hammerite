# Hammerite

A framework which allows you to easily create software using the modular building blocks it provides

## Installation

If you don't have Sass installed,  make sure you have installed Ruby. Grab the installer from [rubyinstaller.org](http://rubyinstaller.org)
After that open a command prompt and write: 

`gem install compass`

and thereafter the following line to install all packages & libraries. [nodeJS](https://nodejs.org) is required for this

`npm install`

## Usage

To make sure changes to the code are directly merged in the css use `grunt watch`.

Run `grunt` for building and `grunt serve` for preview and development.

## Code Examples

Html example of a component

```html
<div class="c-panel">
    <div class="c-panel__header">
        <h4 class="c-panel__title">Panel header</h4>
        <div class="c-panel__action">
            <svg class="c-icon o-icon--xxsmall">
                <use xlink:href="#u4-icon--pencil"></use>
            </svg>
        </div>
    </div>
    <div class="c-panel__body">
        <p></p>
    </div>
</div>
```


Sass example

```scss
.#{$class-prefix-c}-panel {
    @include border($panel-border-style, $panel-border-color, $panel-border-width);
    position: relative;
}
```

## Contribution

If you have come across a bug or have a feature request, please open one here. 

### Bug report
When submitting a bug report please add the following:

* Detailed description of the bug
* Version bug was found on
* Which steps to reproduce
* Expected result/solution

### Feature request
Before filing a feature request, be sure to check the existing features to if the idea has already been proposed.

A good feature request is:

* A concrete idea that is reasonable for use within the library
* Includes relevant information such as background information, the need for such a feature, use cases, expected outcomes and any other information useful to one who is considering the request.

## Authors

* [Jonatan Rueda](mailto:jonatan.rueda@unit4.com) (UX Center Granada)
* [Luis Ramos](mailto:luis.ramos@unit4.com) (UX Center Granada)
* [Maciej Goldsztejn](mailto:Maciej.goldsztejn@unit4.com) (UX Center Wroclaw)
* [Owain Kleefkens](mailto:owain.kleefkens@unit4.com) (UX Center Utrecht)

For general questions related to the framework contact [Owain Kleefkens](mailto:owain.kleefkens@unit4.com). All other questions can be relayed to [framework@unit4.com](mailto:framework@unit4.com)

## License

Copyright (c) 2017 UX Center
Licensed under the MIT license.