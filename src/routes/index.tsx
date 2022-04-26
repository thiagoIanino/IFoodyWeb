import { Switch, Route } from 'react-router-dom';
import Login from "../pages/Login"
import CadastroCliente from "../pages/Cadastro/Cliente"
import CadastroRestaurante from "../pages/Cadastro/Restaurante"
import Restaurante from "../pages/Restaurante"
import Home from "../pages/Home"
import RestauranteCategoria from '../pages/RestauranteCategoria'
import RestauranteGerencia from '../pages/RestauranteGerencia';
import PedidosRestaurante from '../pages/PedidosRestaurante';


const Routes = () => (
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/login" component={Login} />
    <Route path="/cadastro/cliente" exact component={CadastroCliente} />
    <Route path="/cadastro/restaurante" component={CadastroRestaurante} />
    <Route path="/restaurantes/:id" exact component={Restaurante} />
    <Route path="/restaurantes/categorias/:categoria"  component={RestauranteCategoria} />
    <Route path="/restaurantesGerencia/:id" exact component={RestauranteGerencia} />
    <Route path="/restaurantesGerencia/:id/pedidos"   component={PedidosRestaurante} />
  </Switch>
);

export default Routes;