const graphql = require('graphql')
const axios = require('axios')
const mongoose = require('mongoose')
const UserModel = require('../models/users')
const ProductModel = require('../models/product')
const CategoryModel = require('../models/category')
const _ = require('lodash')

function getProjection (fieldASTs) {
  return fieldASTs.fieldNodes[0].selectionSet.selections.reduce((projections, selection) => {
    projections[selection.name.value] = true;
    return projections;
  }, {});
}

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLFloat
} = graphql

const ColorType = new GraphQLObjectType({
  name: "Color",
  fields: {
    name: {type: GraphQLString},
    images: {
      type: new GraphQLList(GraphQLString)
    },
    quantity: {type: GraphQLInt}
  }
})
const CompanyType = new GraphQLObjectType({
  name: "Company",
  fields: () => ({
    id: {type: GraphQLString},
    name: {type: GraphQLString},
    description: {type: GraphQLString},
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
        .then(res => res.data)
      }
    }
  })
})


const AttributeProductType = new GraphQLObjectType({
  name: 'AttributeProduct',
  fields: {
    attribute_id: {type: GraphQLString},
    product_id: {type: GraphQLString},
    value: {type: GraphQLString}
  }
})

const AddressType = new GraphQLObjectType({
  name: 'Address',
  fields: {
    street: {type: GraphQLString},
    city: {type: GraphQLString},
    state: {type: GraphQLString}
  }
})

const CategoryType = new GraphQLObjectType({
  name: 'Category',
  fields: () => ( {
    _id: {type: GraphQLString},
    name: {type: GraphQLString},
    description: {type: GraphQLString},
    meta_title: {type: GraphQLString},
    meta_description: {type: GraphQLString},
    parent_id: {type: GraphQLString},
    products: {
      type: new GraphQLList(ProductType),
      resolve(parentValue, args) {
        return ProductModel.find({
          categories: ['59d4f71df36d285c5da667d5']
        }).exec()
      }
    },
    subcategories: {
      type: new GraphQLList(CategoryType),
      resolve(parentValue, args) {
        return CategoryModel.find({_id: parentValue._id}).exec()
      }
    },
    parent: {
      type: CategoryType,
      resolve(parentValue, args) {
        return CategoryModel.findOne({_id: parentValue.parent_id}).exec()
      }
    }
  })
})

const OptionGroupType = new GraphQLObjectType({
  name: 'OptionGroup',
  fields: {
    name: {type: GraphQLString},
    description: {type: GraphQLString},
    order: {type: GraphQLInt}
  }
})

const OptionType = new GraphQLObjectType({
  name: 'Option',
  fields: {
    name: {type: GraphQLString},
    description: {type: GraphQLString},
    picture_id: {type: GraphQLString}
  }
})


const ProductType = new GraphQLObjectType({
  name: 'Product',
  fields: () => ({
    _id: {type: GraphQLString},
    name: {type: GraphQLString},
    model: {type: GraphQLInt},
    description_short: {type: GraphQLString},
    description: {type: GraphQLString},
    meta_title: {type: GraphQLString},
    meta_description: {type: GraphQLString},
    slug: {type: GraphQLString},
    price: {type: GraphQLFloat},
    colors: {type: new GraphQLList(ColorType)},
    similar: {type: new GraphQLList(GraphQLString)},
    similarProducts: {
      type: new GraphQLList(ProductType),
      resolve(parentValue, args) {

        let isSimilarTo = ProductModel.find({
          similar: parentValue._id
        }).exec()

        let similars =  ProductModel.find({
          _id: parentValue.similar
        }).exec()

        return Promise.all([isSimilarTo, similars]).then((res) => {
          let concated = res[0].concat(res[1])
          return _.uniqBy(concated, '_id')
        })
      }

    }
  })
})

const OrderItemType = new GraphQLObjectType({
  name: 'OrderItem',
  fields: {
    product_id: {type: GraphQLString},
    option: {type: OptionType},
    quantity: {type: GraphQLInt}
  }
})

const OrderType = new GraphQLObjectType({
  name: 'Order',
  fields: {
    order_item: {
      type: OrderItemType,
      resolve(parentValue, args) {
        return {}
      }
    }
  }
})

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: {type: GraphQLString},
    name: {type:GraphQLString},
    email: {type:GraphQLString} ,
    password: {type:GraphQLString},
    level: {type:GraphQLInt},
    attribute_ids: {type: new GraphQLList(GraphQLString)},
    attributes: {
      type: new GraphQLList(AttributeProductType),
      resolve(parentValue, args) {
        return AttributeProductModel.find({

        })
      }
    },
    orders: {
      type: new GraphQLList(OrderType),
      resolve(parentValue, args) {
        return []
      }
    },
    addresses: {
      type: new GraphQLList(AddressType),
      resolve(parentValue, args) {
        return []
      }
    }
  }
})

const ViewerType = new GraphQLObjectType({
  name:"Viewer",
  fields: {
    allCategories: {
      type: new GraphQLList(CategoryType),
      args: {first: {type: GraphQLInt}},
      resolve(parentValue, args) {
        return CategoryModel.find({}).exec()
      }
    }
  }
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    viewer: {
      type: ViewerType,
      resolve(parentValue, args) {
        return {name:"Simeon"}
      }
    },
    loggedInUser: {
      type: UserType,
      resolve(parentValue, args, context) {
        return context.user
      }
    },
    user: {
      type: UserType,
      args: {id: {type: GraphQLString}},
      resolve(parentValue, args, third, ast) {
        return UserModel.findOne({name:'simeon babev'}).exec()
      }
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return []
      }
    },
    allCategories: {
      type: new GraphQLList(CategoryType),
      args: {first: {type: GraphQLInt}},
      resolve(parentValue, args, context) {
        console.log(context.user)
        return CategoryModel.find({}).exec()
      }
    },
    getCategory: {
      type: CategoryType,
      args: {slug: {type: GraphQLString}},
      resolve(parentValue, args, context) {
        console.log(args.slug)
        return CategoryModel.findOne({
          slug: args.slug
        }).exec()
      }
    },
    getProduct: {
      type: ProductType,
      args: {slug: {type: GraphQLString}},
      resolve(parentValue, args, context) {
        return ProductModel.findOne({
          slug: args.slug
        }).exec()
      }
    },
    getRouteType: {
      type: GraphQLString,
      args: {slug: {type: GraphQLString}},
      resolve(parentValue, args, context) {
        let category = CategoryModel.findOne({slug: args.slug}).select('slug').exec()
        let product = ProductModel.findOne({slug: args.slug}).select('slug').exec()
        return Promise.all([category, product]).then((res) => {
          if(res[0])
            return  'category'
          else if(res[1])
            return 'product'
          else
            return null
        })
      }
    }
  }
})

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        firstname: {type: new GraphQLNonNull(GraphQLString)},
        age: {type: new GraphQLNonNull(GraphQLInt)},
        companyId: {type: GraphQLString}
      },
      resolve(parentValue, {firstname, age}) {
        return axios.post('http://localhost:3000/users', {
          firstname,
          age
        })
        .then(res => res.data)
      }
    },
    deleteUser: {
      type: UserType,
      args: {
        id: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve(parentValue, {id}) {
        return axios.delete(`http://localhost:3000/users/${id}`)
        .then(res => res.data)
      }
    },
    editUser: {
      type: UserType,
      args: {
        id: {type: new GraphQLNonNull(GraphQLString)},
        firstname: {type: GraphQLString},
        age: {type: GraphQLInt},
        companyID: {type: GraphQLString}
      },
      resolve(parentValue, args) {
        return axios.patch(`http://localhost:3000/users/${args.id}`, args)
        .then(res => res.data)
      }
    }
  }
})
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
})
