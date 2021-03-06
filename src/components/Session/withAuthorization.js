import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const withAuthorization = condition => Component => {
    class WithAuthorization extends React.Component {
        componentDidMount() {
            this.listener = this.props.firebase.onAuthUserListener(
                authUser => {
                    if (!condition(authUser)) {
                        this.props.history.push(ROUTES.LOGIN);
                    }
                },
                () => this.props.history.push(ROUTES.LOGIN),
            );
        }

        componentWillUnmount() {
            this.listener();
        }

        render() {
            return condition(this.props.authUser) ? (
                <Component {...this.props} />
            ) : null;
        }
    }

    const mapStateToProps = state => ({
        authUser: state.authUser,
    });

    return compose(
        withRouter,
        withFirebase,
        connect(mapStateToProps),
    )(WithAuthorization);
};

export default withAuthorization;