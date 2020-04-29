import { Page, PageProps } from "../../mod";

interface Props extends PageProps {}
interface State {}

class Index extends Page<Props, State> {
  render() {
    return (
      <div>
        hello, world
        <br />
        hi
      </div>
    );
  }
}
