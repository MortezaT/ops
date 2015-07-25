"use strict";
(function () {

	var Table = (function () {
		var instance = {};

		return function Table (dataTable, configTable) {
			var _db = localStorage,
			_table = {};

			if (instance[dataTable]) 
				return instance[dataTable];

			function _get(target) {
				var t = (target === 'config')? configTable: dataTable,
				r = JSON.parse( _db.getItem(t) ),
				resultType = (target === 'config')? 'Object': 'Array';

				if ( typeOf(r) !==  resultType) 
					return false

				if (target === 'config'){
					_table.Config = r;
				} else {
					_table.Data = r;
				}

				return true;
			}

			function _set(target) {
				var t = (target === 'config')? configTable: dataTable;
				var q = (target === 'config')? _table.Config: _table.Data;

				_db.setItem (t, JSON.stringify(q));

				return _get(target);
			}

			new Fields({
				data: {type: 'array'},
				config: {type: 'object'},
			}, _table);

			new Methods({
				selectOrCreate: { final: true,
					callBack: function () {
						if (_table.select()){

							return true;
						}
						return _table.create();
					}
				},
				select:{ final: true,
					callBack:  function () {
						_get('config');
						if (_get()){
							return true;
						}
					}
				},
				create:{ final: true,
					callBack: function () {
						console.info('Creating table "'+ dataTable + '" and config "' + configTable + '"');
						_table.Config = { 
							lastInsertedID: 0,
						};
						_table.update();
						return true
					}
				},
				update:{ final: true,
					callBack: function (argument) {
						_set ();
						_set ('config');

						return _table.select();			
					}
				}
			}, _table);

			instance[dataTable] = _table;
			return _table;
		}
	})();

	window.MyCRUD = function (args) {
		var that = this,
			queryInProgress = false,
			pristine = {},
			model, dataTable, configTable, id, data, config, _table;

		DataObject.call(that);

		var resultAspectHandler = function () {
			var aspect = {};

			new Methods({
				init: function () {
					_result.refresh();
					aspect.start();
					return aspect;
				},
				initNoQuery: function () {
					if (! aspect.inProgress()) 
						_result.refresh();
					return aspect;
				},
				start: function () {
					queryInProgress = true;
					return aspect;
				},
				terminate: function () {
					queryInProgress = false;
					return aspect;
				},
				reset: function () {
					_result.refresh();
					aspect.terminate();
					return aspect;
				},
				inProgress: function () {
					return queryInProgress;
				}
			}, aspect);
			return aspect;
		}

		new Fields({
			iD: {type: 'number'},
			created_at: {type: 'date'},
			updated_at: {type: 'date'},
		}, that);

		new Fields({
			iD: {type: 'number'},
			created_at: {type: 'date'},
		}, pristine);

		new Methods({
			save		: function () {
				if (_table.select()) {
					/** if (that.valid()) {}; */
					that.ID = ++ _table.Config.lastInsertedID;
					that.Created_at = (new Date).toJSON();
					that.Updated_at = null;
					var d = that.clone();

					_table.Data.push(d);
					_table.update();
					return that.ID;
				};
				throw 'DB_UNKNOWN_ERROR';
			},update	: function () {
				// resultAspectHandler().terminate().reset();

				that.ID = pristine.ID;
				that.Updated_at = pristine.Created_at;
				that.Updated_at = (new Date).toJSON();

				/** if (that.valid()) {}; */
				for (var i = _table.Data.length - 1; i >= 0; i--) {
					var object = _table.Data[i];
					if (object.ID == that.ID) {
						_table.Data[i] = that.clone();
						_table.update();
						return true;
					};
				};
				return false;
			},delete	: function () {
				resultAspectHandler().terminate().reset();
				// remove this from DataBase
				that.ID = pristine.ID;
				for (var i = _table.Data.length - 1; i >= 0; i--) {
					var object = _table.Data[i];
					if (object.ID == that.ID) {
						_table.Data.splice(i, 1);
						_table.update();
						return true;
					};
				};
				return false;
			},select	: function (fields) {
				resultAspectHandler().initNoQuery();
				// result contains fields
				if (typeOf(fields) !== 'Array') 
					fields = [fields];
				var r = []
				source = _result.clone().Data;

				for (var i = 0; i < source.length; i++) {
					var d = source[i],
					object = {};
					for (var j = 0; j < fields.length; j++) {
						var field = fields[j];
						object[field] = d[field];
					};
					r.push(object);
				};
				_result.Data = r;

				return that;
			},all		: function () {
				// Return all model data
				resultAspectHandler().reset();
				return _result.Data;
			},first		: function () {
				resultAspectHandler().initNoQuery().terminate();
				// Return first query result
				var index = 0;
				return _result.Data[index] || null;
			},last		: function () {
				resultAspectHandler().initNoQuery().terminate();
				// Return last query result
				var index = _result.Data.length -1;
				return _result.Data[index] || null;
			},orderBy	: function () {
				resultAspectHandler().init();
				// Sort result by field(|s)
				Array.prototype.sortBy.apply(_result.Data, arguments);
				return that;
			},find		: function (id) {
				resultAspectHandler().terminate();
				var r = _table.Data.find(function (object) {
					return object.ID === id;
				});
				return (r) ? _getNewObjectFromData(r) : null;
			},where		: function (field, relation, value) {
				// narrow the result by limit
				resultAspectHandler().initNoQuery().start()

				var truthFunc = truth(relation);

				_result.Data = 
					_result.Data.filter(function (object) {
						return truthFunc(object.deepVal(field), value)
					});

					return that;
			},get 		: function () {
				if (resultAspectHandler().inProgress()) {
					resultAspectHandler().terminate();
					//return result 
					return _result.Data;
				};
				return null;
			},count		: function () {
				resultAspectHandler().terminate();
				//return result Count
				return _result.Data.length;
			},skip		: function (count) {
				resultAspectHandler().initNoQuery();
				count = parseInt(count);
				if (count)
					_result.Data = _result.Data.slice(count);

				console.log('Skip\t', count, _result.Data.length);
				return that;
			},take		: function (count) {
				resultAspectHandler().initNoQuery();
				count = parseInt(count);
				if (count && _result.Data.length > count)
					_result.Data.length = count;
				
				return that;
			}
		}, 
		that);
		/**
		* 
		*/

		/*############################################################################################*/
		/*###################################### Result Handler ######################################*/
		/*############################################################################################*/
			var _result = {}

			new Fields({
				data: {type: 'array'},
				error: {type: 'boolean'},
				message: {type: 'string'},
				/*statusCode:‌ {type: 'number'},*/
			}, _result);

			new Methods({
				refresh: function () {
					_result.clean();
					for (var i = 0; i < _table.Data.length; i++) {
						_result.Data.push(_getNewObjectFromData(_table.Data[i]));
					};
				},
				clean: function () {
					_result.Data = [];
					_result.Error = false;
					_result.Message = '';
				},
				error: function (msg) {
					_result.Data = [];
					_result.Message = msg;
					_result.Error = true;
					throw msg;
				},
				single: function (index) {
					_result.Data = [_result.Data[index]];
					if (! _result.Error){
						return _result.Data[0];
					}
				}
			},_result);
			DataObject.call(_result);
		/*************************************** /Result Handler **************************************/

		_construct(args);
		return that;

		function _construct (args) {
			model = that.constructor.name;

			if (!model) 
				throw 'INVALID_MODEL';

			dataTable = owl.pluralize(CaseConvert(model).to_snake().get()),
			configTable = '_' + dataTable,
			id = that.ID,
			data = [],
			config = {},
			_table = Table(dataTable, configTable);

			that.ID         = pristine.ID 			= args.ID;
			that.Created_at = pristine.Created_at 	= args.Created_at;
			that.Updated_at = args.Updated_at;

			if (_table.selectOrCreate());
			/*
				console.info('New instance of model "' + model + '" Connected to table "' + dataTable + '"');
			*/

			// console.warn(model + ' initiation\t->\t' ,args.ID + ':\t' + args.Title, args.Phones && args.Phones.length);
		}

		function _getNewObjectFromData(data) {
			var object = new window[model](data);
			object.ID = data.ID;
			return object;
		}


		function truth (relation) {
			var comp = OPERATOR.CALL.COMPARISON[relation];
			if (comp)
				return function (leftValue, rightValue) {
					return comp(leftValue, rightValue);
				}
			return function (object, value) {
				if (object[relation]) 
					return object[relation](value);
				_result.error ('INVALID_RELATION_METHOD');
				return false;
			}
		}


	}
})();
