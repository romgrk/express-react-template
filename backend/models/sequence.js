
module.exports = (sequelize, DataTypes) => {
  const Sequence = sequelize.define('Sequence',
    {
      userId: DataTypes.INTEGER,

      strain: DataTypes.STRING,
      collectionDate: DataTypes.DATE,
      age: DataTypes.INTEGER,
      sex: DataTypes.STRING,
      province: DataTypes.STRING,
      lab: DataTypes.STRING,

      data: DataTypes.TEXT,
    },
    {
      tableName: 'sequences',
    }
  );
  return Sequence;
};

