import {ToyReact, Component} from './ToyReact'

class MyComponent extends Component{
    render() {
        return <div name="a" id="id">
            <span>Good </span>
            <span>evening </span>
            <span>!</span>
            <div>
                {true}
                {this.children}
                <div>lll</div>
            </div>
         </div>
    }
}
let a = <MyComponent name="a">
    <div>my children</div>
</MyComponent>


// let comp = <div name="a" id="id">
//     <span>Good </span>
//     <span>evening </span>
//     <span>!</span>
// </div>
console.log(a)
ToyReact.render(
    a,
    document.body
)