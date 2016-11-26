// HAL+json description of the API

function ApiInfo() {
    this.Title = 'Todo API';
    this._links = [
            { self: { href: '/' } },
            { todo: [
                {href: '/todo'},
                {href: '/todo/{id}', templated: true}
            ]}
        ];
}

module.exports = ApiInfo;