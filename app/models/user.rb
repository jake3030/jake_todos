class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  has_many :todos

  validates_presence_of :first_name
  validates_presence_of :last_name

  after_create :set_api_key


  def as_json(opts = {})
    super opts.reverse_merge({
      :except => [
        :user_id,
        :updated_at
      ]
    })
  end


  def set_api_key
    self.update_attribute(:api_key, Devise.friendly_token)
  end

end
