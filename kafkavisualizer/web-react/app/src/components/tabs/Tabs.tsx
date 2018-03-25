import * as React from 'react';

interface TabProps {
    title: string;
}

export class Tab extends React.Component<TabProps, {}> {

    render() {
        return this.props.children;
    }
}

interface TabsProps {
    // tslint:disable-next-line:no-any
    children?: React.ReactElement<any>[];
}

interface TabsState {
    activeTabIndex: number;
}

export class Tabs extends React.Component<TabsProps, TabsState> {

    // tslint:disable-next-line:no-any
    constructor(props: TabsProps, context: any) {
        super(props, context);
        this.validateChildren(React.Children.toArray(this.props.children));
        this.state = {
            activeTabIndex: 0
        };
    }

    render() {

        // tslint:disable-next-line:no-any
        let tabs: React.ReactElement<any>[] = [];
        // tslint:disable-next-line:no-any
        let tabBodies: React.ReactElement<any>[] = [];

        // tslint:disable-next-line:no-any
        React.Children.forEach(this.props.children, (child: any, index) => {
            tabs.push(
                <a
                    key={index}
                    className={index === this.state.activeTabIndex ? 'nav-item nav-link active pointable' : 'nav-item nav-link pointable'}
                    data-toggle="tab"
                    role="tab"
                    onClick={(event) => this.onTabClick(index)}
                >
                    {(child as Tab).props.title}
                </a>
            );

            tabBodies.push(
                <div style={index === this.state.activeTabIndex ? { display: 'block' } : { display: 'none' }}>
                    {child}
                </div>
            );
        });

        return (
            <div style={{ marginTop: '10px' }}>
                <nav>
                    <div className="nav nav-tabs" role="tablist">
                        {tabs}
                    </div>
                </nav>
                <div>
                    {tabBodies}
                </div>
            </div>
        );
    }

    // tslint:disable-next-line:no-any
    private validateChildren(children: any[]) {
        if (children.length === 0) {
            throw new Error('At least one tab must be supplied as a child.');
        }

        for (let child of children) {
            if (child.type !== Tab) {
                throw new Error('Only children of type \'Tab\' are allowed.');
            }
        }
    }

    private onTabClick(tabIndex: number) {
        this.setState({ ...this.state, activeTabIndex: tabIndex });
    }
} 