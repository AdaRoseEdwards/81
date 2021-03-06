const REDIS = require('redis');
const denodeify = require('denodeify');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redis = (function () {
	if (process.env.REDISTOGO_URL) {
		const rtg = require('url').parse(process.env.REDISTOGO_URL);
		const redis = REDIS.createClient(rtg.port, rtg.hostname);

		redis.auth(rtg.auth.split(':')[1]);
		return redis;
	} else {
	 	return REDIS.createClient();
	}
}());
const redisStore = new RedisStore({
	client : redis
});

module.exports = {
	redisStore,
	redisGet: denodeify(redis.get).bind(redis),
	redisSet: denodeify(redis.set).bind(redis),
	redisLPush: denodeify(redis.lpush).bind(redis),
	redisLRange: denodeify(redis.lrange).bind(redis),
	redisHGet: denodeify(redis.hget).bind(redis),
	redisHSet: denodeify(redis.hset).bind(redis)
};
